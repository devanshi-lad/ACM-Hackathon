import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export type WasteCategory = 'recyclable' | 'biodegradable' | 'hazardous';

export interface ClassificationResult {
  category: WasteCategory;
  confidence: number;
  rawPredictions: Array<{ label: string; score: number }>;
}

// Mapping from ImageNet classes to waste categories
const wasteMapping: Record<string, WasteCategory> = {
  // Recyclable items
  'bottle': 'recyclable',
  'plastic bag': 'recyclable', 
  'beer bottle': 'recyclable',
  'wine bottle': 'recyclable',
  'pop bottle': 'recyclable',
  'water bottle': 'recyclable',
  'can': 'recyclable',
  'tin can': 'recyclable',
  'aluminum can': 'recyclable',
  'newspaper': 'recyclable',
  'cardboard': 'recyclable',
  'paper': 'recyclable',
  'magazine': 'recyclable',
  'book': 'recyclable',
  'carton': 'recyclable',
  'jar': 'recyclable',
  'glass': 'recyclable',
  'container': 'recyclable',
  
  // Biodegradable items  
  'banana': 'biodegradable',
  'apple': 'biodegradable',
  'orange': 'biodegradable',
  'lemon': 'biodegradable',
  'strawberry': 'biodegradable',
  'broccoli': 'biodegradable',
  'carrot': 'biodegradable',
  'corn': 'biodegradable',
  'potato': 'biodegradable',
  'mushroom': 'biodegradable',
  'leaf': 'biodegradable',
  'flower': 'biodegradable',
  'bread': 'biodegradable',
  'pizza': 'biodegradable',
  'sandwich': 'biodegradable',
  'bagel': 'biodegradable',
  'egg': 'biodegradable',
  'meat': 'biodegradable',
  'fish': 'biodegradable',
  'salad': 'biodegradable',
  'vegetable': 'biodegradable',
  'fruit': 'biodegradable',
  'food': 'biodegradable',
  
  // Hazardous items
  'battery': 'hazardous',
  'phone': 'hazardous',
  'laptop': 'hazardous',
  'computer': 'hazardous',
  'television': 'hazardous',
  'monitor': 'hazardous',
  'light bulb': 'hazardous',
  'fluorescent': 'hazardous',
  'paint': 'hazardous',
  'chemical': 'hazardous',
  'cleaning product': 'hazardous',
  'aerosol': 'hazardous',
  'spray': 'hazardous',
  'medicine': 'hazardous',
  'pill': 'hazardous',
  'syringe': 'hazardous',
  'thermometer': 'hazardous',
  
  // Additional electronics and e-waste
  'modem': 'hazardous',
  'router': 'hazardous',
  'radio': 'hazardous',
  'remote': 'hazardous',
  'remote control': 'hazardous',
  'joystick': 'hazardous',
  'digital watch': 'hazardous',
  'watch': 'hazardous',
  'controller': 'hazardous',
  'game controller': 'hazardous',
  'console': 'hazardous',
  'printer': 'hazardous',
  'scanner': 'hazardous',
  'camera': 'hazardous',
  'charger': 'hazardous',
  'power adapter': 'hazardous',
  'earphone': 'hazardous',
  'earphones': 'hazardous',
  'headphone': 'hazardous',
  'headphones': 'hazardous',
  'earbuds': 'hazardous',
  'electronic': 'hazardous',
  'device': 'hazardous',
  'equipment': 'hazardous',
  
  // Large items often misdetected as vehicles
  'bus': 'hazardous',
  'minibus': 'hazardous',
  'van': 'hazardous',
  'truck': 'hazardous',
  'car': 'hazardous'
};

let classifier: any = null;

async function initializeClassifier() {
  if (!classifier) {
    console.log('Initializing image classifier...');
    classifier = await pipeline(
      'image-classification',
      'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
      { 
        device: 'webgpu',
        dtype: 'fp32'
      }
    );
    console.log('Classifier initialized successfully');
  }
  return classifier;
}

function calculateSemanticSimilarity(predictions: Array<{ label: string; score: number }>): ClassificationResult {
  // Define semantic categories with contextual understanding
  const semanticCategories = {
    recyclable: {
      materials: ['plastic', 'glass', 'metal', 'aluminum', 'steel', 'paper', 'cardboard', 'tin'],
      containers: ['bottle', 'jar', 'can', 'container', 'cup', 'box', 'carton', 'package'],
      objects: ['magazine', 'newspaper', 'book', 'envelope', 'wrapper'],
      weight: 0.0
    },
    biodegradable: {
      organic: ['fruit', 'vegetable', 'plant', 'leaf', 'flower', 'wood', 'organic'],
      food: ['bread', 'meat', 'fish', 'egg', 'cheese', 'pizza', 'sandwich', 'salad', 'soup'],
      natural: ['banana', 'apple', 'orange', 'carrot', 'potato', 'corn', 'mushroom'],
      weight: 0.0
    },
    hazardous: {
      electronics: ['phone', 'computer', 'laptop', 'television', 'monitor', 'electronic'],
      chemicals: ['battery', 'paint', 'chemical', 'cleaning', 'toxic', 'dangerous'],
      medical: ['medicine', 'pill', 'syringe', 'thermometer', 'medical'],
      weight: 0.0
    }
  };

  // Calculate semantic similarity scores for each category
  for (const prediction of predictions) {
    const label = prediction.label.toLowerCase();
    const score = prediction.score;

    // Check each category
    for (const [category, groups] of Object.entries(semanticCategories)) {
      let maxSimilarity = 0;
      
      // Check all semantic groups within the category
      for (const keywords of Object.values(groups)) {
        if (Array.isArray(keywords)) {
          for (const keyword of keywords) {
            // Calculate similarity based on substring matching and context
            let similarity = 0;
            
            if (label.includes(keyword) || keyword.includes(label)) {
              similarity = 1.0; // Perfect match
            } else if (label.split(' ').some(word => keyword.includes(word) || word.includes(keyword))) {
              similarity = 0.8; // Partial word match
            } else {
              // Check for semantic similarity patterns
              const labelWords = label.split(/[,\s]+/);
              const keywordWords = keyword.split(/[,\s]+/);
              
              for (const labelWord of labelWords) {
                for (const keywordWord of keywordWords) {
                  if (labelWord.length > 2 && keywordWord.length > 2) {
                    if (labelWord.includes(keywordWord) || keywordWord.includes(labelWord)) {
                      similarity = Math.max(similarity, 0.6);
                    }
                  }
                }
              }
            }
            
            maxSimilarity = Math.max(maxSimilarity, similarity);
          }
        }
      }
      
      // Weight the similarity by the prediction confidence
      semanticCategories[category as keyof typeof semanticCategories].weight += maxSimilarity * score;
    }
  }

  // Find the category with highest weighted similarity
  let bestCategory: WasteCategory = 'recyclable';
  let bestScore = 0;
  let confidence = 0;

  for (const [category, data] of Object.entries(semanticCategories)) {
    if (data.weight > bestScore) {
      bestScore = data.weight;
      bestCategory = category as WasteCategory;
      confidence = Math.min(0.95, data.weight); // Cap confidence at 95%
    }
  }

  // If no strong semantic match found, use contextual reasoning
  if (bestScore < 0.3) {
    const topPrediction = predictions[0];
    const label = topPrediction.label.toLowerCase();
    
    // Apply contextual reasoning based on common object patterns
    if (label.includes('container') || label.includes('package') || label.includes('wrapper')) {
      bestCategory = 'recyclable';
      confidence = topPrediction.score * 0.7;
    } else if (label.includes('food') || label.includes('organic') || label.includes('natural')) {
      bestCategory = 'biodegradable';
      confidence = topPrediction.score * 0.7;
    } else if (label.includes('device') || label.includes('machine') || label.includes('equipment')) {
      bestCategory = 'hazardous';
      confidence = topPrediction.score * 0.7;
    } else {
      // Default to most likely category based on general waste statistics
      bestCategory = 'recyclable';
      confidence = Math.max(0.4, topPrediction.score * 0.6);
    }
  }

  return {
    category: bestCategory,
    confidence: Math.max(0.3, confidence), // Minimum 30% confidence
    rawPredictions: predictions
  };
}

export async function classifyWaste(imageFile: File): Promise<ClassificationResult> {
  try {
    console.log('Starting waste classification...');
    
    const model = await initializeClassifier();
    
    // Convert file to image URL for processing
    const imageUrl = URL.createObjectURL(imageFile);
    
    console.log('Processing image with classifier...');
    const predictions = await model(imageUrl);
    
    console.log('Raw predictions:', predictions);
    
    // Clean up the URL
    URL.revokeObjectURL(imageUrl);
    
    if (!predictions || predictions.length === 0) {
      throw new Error('No predictions received from classifier');
    }

    const result = calculateSemanticSimilarity(predictions);
    console.log('Final classification result:', result);
    
    return result;
    
  } catch (error) {
    console.error('Error in waste classification:', error);
    throw new Error(`Classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}