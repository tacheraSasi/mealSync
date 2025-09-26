import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  Star, 
  DollarSign, 
  Leaf,
  AlertTriangle
} from 'lucide-react';

const MealCard = ({ meal, isSelected, onSelect, userDietaryPreferences = [] }) => {
  const getDietaryBadgeColor = (tag) => {
    const colors = {
      'vegetarian': 'bg-green-100 text-green-800',
      'vegan': 'bg-emerald-100 text-emerald-800',
      'halal': 'bg-blue-100 text-blue-800',
      'kosher': 'bg-purple-100 text-purple-800',
      'gluten-free': 'bg-orange-100 text-orange-800',
      'dairy-free': 'bg-yellow-100 text-yellow-800',
      'nut-free': 'bg-red-100 text-red-800'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  const hasAllergenConflict = () => {
    if (!meal.allergens || !userDietaryPreferences.length) return false;
    
    const userRestrictions = userDietaryPreferences.map(p => p.preference);
    return meal.allergens.some(allergen => {
      // Check if user has restrictions that conflict with allergens
      if (allergen === 'nuts' && userRestrictions.includes('nut-free')) return true;
      if (allergen === 'dairy' && userRestrictions.includes('dairy-free')) return true;
      if (allergen === 'gluten' && userRestrictions.includes('gluten-free')) return true;
      return false;
    });
  };

  const isCompatibleWithDiet = () => {
    if (!meal.dietaryTags || !userDietaryPreferences.length) return true;
    
    const userRestrictions = userDietaryPreferences.map(p => p.preference);
    return userRestrictions.some(restriction => 
      meal.dietaryTags.includes(restriction)
    );
  };

  const hasConflict = hasAllergenConflict();
  const isCompatible = isCompatibleWithDiet();

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-emerald-500 shadow-md' 
          : hasConflict 
            ? 'border-red-200 bg-red-50' 
            : 'hover:border-emerald-200'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold ${hasConflict ? 'text-red-800' : 'text-slate-900'}`}>
                {meal.name}
              </h3>
              <p className="text-sm text-slate-600 mt-1">{meal.description}</p>
            </div>
            {hasConflict && (
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
            )}
          </div>

          {/* Dietary Tags */}
          {meal.dietaryTags && meal.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {meal.dietaryTags.map((tag) => (
                <Badge 
                  key={tag} 
                  className={`text-xs ${getDietaryBadgeColor(tag)}`}
                >
                  <Leaf className="h-3 w-3 mr-1" />
                  {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                </Badge>
              ))}
            </div>
          )}

          {/* Allergen Warning */}
          {hasConflict && (
            <div className="bg-red-100 border border-red-200 rounded-md p-2">
              <p className="text-xs text-red-800 font-medium">
                ⚠️ This meal contains allergens that conflict with your dietary preferences
              </p>
            </div>
          )}

          {/* Compatibility Notice */}
          {!hasConflict && !isCompatible && userDietaryPreferences.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
              <p className="text-xs text-amber-800">
                This meal may not match your dietary preferences
              </p>
            </div>
          )}

          {/* Bottom Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {/* Rating */}
              {meal.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-slate-600">{meal.averageRating.toFixed(1)}</span>
                  <span className="text-slate-400">({meal.totalRatings})</span>
                </div>
              )}
              
              {/* Price */}
              {meal.price && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-slate-600">${meal.price.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Nutritional Info */}
            {meal.nutritionalInfo?.calories && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">{meal.nutritionalInfo.calories} cal</span>
              </div>
            )}
          </div>

          {/* Selection Button */}
          <Button
            variant={isSelected ? "default" : hasConflict ? "destructive" : "outline"}
            size="sm"
            className={`w-full ${
              isSelected 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : hasConflict
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? '✓ Selected' : hasConflict ? 'Select Anyway' : 'Select Meal'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;