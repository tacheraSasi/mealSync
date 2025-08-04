import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Utensils } from 'lucide-react';

const MealTemplateSelector = ({ 
  mealTemplates, 
  selectedMealId, 
  onMealSelect, 
  day 
}) => {
  const [showAll, setShowAll] = useState(false);

  // Show first 6 templates initially, then show all if requested
  const displayTemplates = showAll ? mealTemplates : mealTemplates.slice(0, 6);

  const handleMealSelect = (mealId) => {
    // If clicking the same meal, deselect it
    if (selectedMealId === mealId) {
      onMealSelect(null);
    } else {
      onMealSelect(mealId);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Main Course': 'bg-blue-100 text-blue-800',
      'Soup': 'bg-orange-100 text-orange-800',
      'Salad': 'bg-green-100 text-green-800',
      'Dessert': 'bg-purple-100 text-purple-800',
      'Beverage': 'bg-cyan-100 text-cyan-800',
      'Other': 'bg-slate-100 text-slate-800'
    };
    return colors[category] || colors['Other'];
  };

  if (!mealTemplates || mealTemplates.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No meal options available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected meal display */}
      {selectedMealId && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          {(() => {
            const selectedMeal = mealTemplates.find(m => m.id === selectedMealId);
            return selectedMeal ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-emerald-900">{selectedMeal.name}</p>
                  <p className="text-sm text-emerald-700">{selectedMeal.description}</p>
                </div>
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Meal template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayTemplates.map(template => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMealId === template.id
                ? 'ring-2 ring-emerald-500 bg-emerald-50'
                : 'hover:border-slate-300'
            }`}
            onClick={() => handleMealSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-slate-900 line-clamp-1">
                  {template.name}
                </h4>
                {selectedMealId === template.id && (
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 ml-2" />
                )}
              </div>
              
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCategoryColor(template.category)}`}
                >
                  {template.category}
                </Badge>
                
                <span className="text-xs text-slate-500">
                  by {template.createdBy}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show more/less button */}
      {mealTemplates.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-slate-600"
          >
            {showAll ? 'Show Less' : `Show All ${mealTemplates.length} Options`}
          </Button>
        </div>
      )}

      {/* Clear selection button */}
      {selectedMealId && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMealSelect(null)}
            className="text-slate-500 hover:text-slate-700"
          >
            Clear Selection for {day.charAt(0).toUpperCase() + day.slice(1)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealTemplateSelector;
