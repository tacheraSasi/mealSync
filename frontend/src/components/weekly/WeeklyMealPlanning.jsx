import { useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, CheckCircle2, AlertCircle, Utensils, Leaf, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MealTemplateSelector from './MealTemplateSelector';
import WeeklyPlanSummary from './WeeklyPlanSummary';
import MealCard from './MealCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WeeklyMealPlanning = () => {
  const { user } = useAuth();
  const [planningInfo, setPlanningInfo] = useState(null);
  const [mealTemplates, setMealTemplates] = useState([]);
  const [userDietaryPreferences, setUserDietaryPreferences] = useState([]);
  const [weeklySelections, setWeeklySelections] = useState({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null
  });
  const [existingPlan, setExistingPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch planning information and check if today is Friday
  const fetchPlanningInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/weeklyMealPlan/info`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setPlanningInfo(result.result);
      } else {
        setError('Failed to fetch planning information');
      }
    } catch (error) {
      console.error('Error fetching planning info:', error);
      setError('Failed to connect to server');
    }
  };

  // Fetch available meal templates
  const fetchMealTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/mealTemplate`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setMealTemplates(result.result.filter(template => template.isActive));
      } else {
        setError('Failed to fetch meal templates');
      }
    } catch (error) {
      console.error('Error fetching meal templates:', error);
      setError('Failed to load meal options');
    }
  };

  // Fetch user dietary preferences
  const fetchUserDietaryPreferences = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_URL}/dietaryPreference/user/${user.id}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setUserDietaryPreferences(result.result);
      }
    } catch (error) {
      console.error('Error fetching dietary preferences:', error);
      // Don't set error for dietary preferences as it's not critical
    }
  };

  // Fetch existing weekly plan for the user
  const fetchExistingPlan = useCallback(async () => {
    if (!user?.id || !planningInfo?.nextWeekStartDate) return;
    
    try {
      const response = await fetch(`${API_URL}/weeklyMealPlan/user/${user.id}?weekStartDate=${planningInfo.nextWeekStartDate}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setExistingPlan(result.result);
        
        // Populate selections from existing plan
        const selections = { monday: null, tuesday: null, wednesday: null, thursday: null, friday: null };
        result.result.forEach(plan => {
          const day = plan.dayOfWeek.toLowerCase();
          selections[day] = plan.mealTemplateId;
        });
        setWeeklySelections(selections);
      }
    } catch (error) {
      console.error('Error fetching existing plan:', error);
    }
  }, [user?.id, planningInfo?.nextWeekStartDate]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchPlanningInfo(),
        fetchMealTemplates(),
        fetchUserDietaryPreferences()
      ]);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (planningInfo && user) {
      fetchExistingPlan();
    }
  }, [planningInfo, user, fetchExistingPlan]);

  // Handle meal selection for a specific day
  const handleMealSelection = (day, mealTemplateId) => {
    setWeeklySelections(prev => ({
      ...prev,
      [day]: mealTemplateId
    }));
    setError(null);
    setSuccess(false);
  };

  // Submit weekly meal selection
  const handleSubmitWeeklyPlan = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    // Validate at least one meal is selected
    const hasSelections = Object.values(weeklySelections).some(selection => selection !== null);
    if (!hasSelections) {
      setError('Please select at least one meal for the week');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/weeklyMealPlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          weeklySelections: weeklySelections
        })
      });

      const result = await response.json();

      if (result.status === 'created') {
        setSuccess(true);
        setExistingPlan(result.result);
        // Refresh the data
        await fetchExistingPlan();
      } else {
        setError(result.error || 'Failed to submit weekly meal plan');
      }
    } catch (error) {
      console.error('Error submitting weekly plan:', error);
      setError('Failed to submit meal plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the dates for the upcoming week
  const getWeekDates = () => {
    if (!planningInfo?.nextWeekStartDate) return {};
    
    const weekStart = new Date(planningInfo.nextWeekStartDate);
    return {
      monday: weekStart,
      tuesday: addDays(weekStart, 1),
      wednesday: addDays(weekStart, 2),
      thursday: addDays(weekStart, 3),
      friday: addDays(weekStart, 4)
    };
  };

  const weekDates = getWeekDates();
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">Loading weekly meal planning...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-slate-900">Weekly Meal Planning</h1>
        </div>
        <p className="text-slate-600">Plan your meals for the upcoming week</p>
      </div>

      {/* Planning Status Alert */}
      {planningInfo && (
        <Alert className={`mb-6 ${planningInfo.isFridayPlanningDay ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {planningInfo.planningMessage}
            {planningInfo.isFridayPlanningDay && (
              <span className="block text-sm mt-1 text-emerald-700">
                Planning for week of {format(new Date(planningInfo.nextWeekStartDate), 'MMMM d, yyyy')}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            Weekly meal plan submitted successfully! You can modify your selections until the end of Friday.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      {planningInfo?.isFridayPlanningDay ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Meal Selection Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-emerald-600" />
                  Select Your Meals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {daysOfWeek.map(day => (
                  <div key={day} className="border-b border-slate-100 last:border-b-0 pb-8 last:pb-0">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-semibold text-slate-900 capitalize text-lg">{day}</h3>
                        {weekDates[day] && (
                          <p className="text-sm text-slate-500">
                            {format(weekDates[day], 'MMMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      {weeklySelections[day] && (
                        <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                          ✓ Selected
                        </Badge>
                      )}
                    </div>
                    
                    {/* Enhanced Meal Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mealTemplates.map(meal => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          isSelected={weeklySelections[day] === meal.id}
                          onSelect={() => handleMealSelection(day, meal.id)}
                          userDietaryPreferences={userDietaryPreferences}
                        />
                      ))}
                    </div>
                    
                    {mealTemplates.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Utensils className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <p>No meal options available for selection</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmitWeeklyPlan}
                disabled={isSubmitting || !Object.values(weeklySelections).some(s => s !== null)}
                className="bg-emerald-600 hover:bg-emerald-700 px-8"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {existingPlan.length > 0 ? 'Update Weekly Plan' : 'Submit Weekly Plan'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Dietary Preferences Panel */}
            {userDietaryPreferences.length > 0 && (
              <Card className="border-emerald-100">
                <CardHeader className="bg-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <Leaf className="h-5 w-5" />
                    Your Dietary Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {userDietaryPreferences.map((preference) => (
                      <div key={preference.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-700 capitalize">
                          {preference.preference.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-800">
                      💡 Meals are highlighted based on your preferences and potential allergen conflicts are marked.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <WeeklyPlanSummary
              weeklySelections={weeklySelections}
              mealTemplates={mealTemplates}
              weekDates={weekDates}
              existingPlan={existingPlan}
            />
          </div>
        </div>
      ) : (
        /* Not Friday - Show Info Only */
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Weekly Planning Not Available</h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Weekly meal planning is only available on Fridays. Come back on Friday to plan your meals for the next week.
          </p>
          <p className="text-sm text-slate-500">
            Today is {planningInfo?.currentDay}
          </p>

          {/* Show existing plan if available */}
          {existingPlan.length > 0 && (
            <div className="mt-8 max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {existingPlan.map(plan => (
                      <div key={plan.id} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{plan.dayOfWeek}:</span>
                        <span className="text-slate-600">{plan.mealName}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyMealPlanning;
