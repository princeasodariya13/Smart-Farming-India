export const diseaseDatabase: Record<string, any> = {
  // Apple
  "Apple Scab": {
    severity: "Moderate",
    symptoms: ["Olive green to black spots on leaves", "Velvety fungal growth", "Fruit deformity"],
    cause: "Venturia inaequalis fungus",
    organicTreatment: "Neem oil spray, compost tea",
    recommendedPesticides: ["Score", "Bavistin"],
    activeIngredient: "Difenoconazole 25% EC",
    dosePerLitre: "0.5 ml per litre of water",
    recommendedFungicideInsecticide: "Score",
    prevention: ["Rake and destroy fallen leaves", "Prune for air circulation"],
    irrigationAdvice: "Avoid overhead watering.",
    fertilizerAdvice: "Balanced NPK. Avoid excess nitrogen.",
    expectedRecoveryTime: "10-14 days"
  },
  "Apple Black Rot": {
    severity: "High",
    symptoms: ["Purple spots on leaves", "Brown rot on fruits", "Cankers on branches"],
    cause: "Botryosphaeria obtusa fungus",
    organicTreatment: "Prune out dead or diseased wood. Copper fungicide.",
    recommendedPesticides: ["Captan", "Mancozeb"],
    activeIngredient: "Captan 50% WP",
    dosePerLitre: "2 grams per litre of water",
    recommendedFungicideInsecticide: "Captan",
    prevention: ["Remove mummified fruits", "Sanitize pruning tools"],
    irrigationAdvice: "Water at the base.",
    fertilizerAdvice: "Standard apple tree fertilization.",
    expectedRecoveryTime: "Requires continuous management"
  },
  "Cedar Apple Rust": {
    severity: "Moderate",
    symptoms: ["Yellow-orange spots on leaves", "Rust-like spores"],
    cause: "Gymnosporangium juniperi-virginianae",
    organicTreatment: "Sulfur or copper-based sprays",
    recommendedPesticides: ["Tilt", "Bayleton"],
    activeIngredient: "Propiconazole 25% EC",
    dosePerLitre: "1 ml per litre of water",
    recommendedFungicideInsecticide: "Tilt",
    prevention: ["Remove nearby cedar trees", "Plant resistant varieties"],
    irrigationAdvice: "Maintain even soil moisture.",
    fertilizerAdvice: "Apply balanced nutrients.",
    expectedRecoveryTime: "7-10 days"
  },

  // Cherry
  "Powdery Mildew": {
    severity: "Moderate",
    symptoms: ["White powdery growth on leaves", "Curling of leaves", "Stunted growth"],
    cause: "Podosphaera fungus",
    organicTreatment: "Baking soda spray, Sulfur dust",
    recommendedPesticides: ["Karathane", "Bavistin", "Sulfex"],
    activeIngredient: "Wettable Sulfur 80% WP",
    dosePerLitre: "2-3 grams per litre of water",
    recommendedFungicideInsecticide: "Sulfex",
    prevention: ["Improve air circulation", "Plant in full sun"],
    irrigationAdvice: "Avoid plant stress; water deeply.",
    fertilizerAdvice: "Avoid high-nitrogen fertilizers.",
    expectedRecoveryTime: "7-10 days"
  },

  // Corn
  "Cercospora Leaf Spot (Gray Leaf Spot)": {
    severity: "High",
    symptoms: ["Rectangular gray to brown lesions on leaves", "Blighting of entire leaves"],
    cause: "Cercospora zeae-maydis",
    organicTreatment: "Crop rotation, deep plowing",
    recommendedPesticides: ["Amistar Top", "Nativo"],
    activeIngredient: "Azoxystrobin + Difenoconazole",
    dosePerLitre: "1 ml per litre of water",
    recommendedFungicideInsecticide: "Amistar Top",
    prevention: ["Plant resistant hybrids", "Manage crop residue"],
    irrigationAdvice: "Ensure field has good drainage.",
    fertilizerAdvice: "Maintain adequate potassium.",
    expectedRecoveryTime: "1-2 weeks"
  },
  "Common Rust": {
    severity: "Moderate",
    symptoms: ["Rust-colored pustules on both leaf surfaces"],
    cause: "Puccinia sorghi",
    organicTreatment: "Early planting to avoid peak infection",
    recommendedPesticides: ["Tilt", "Folicur"],
    activeIngredient: "Propiconazole 25% EC",
    dosePerLitre: "1 ml per litre of water",
    recommendedFungicideInsecticide: "Tilt",
    prevention: ["Resistant varieties", "Scout early"],
    irrigationAdvice: "Avoid late evening overhead irrigation.",
    fertilizerAdvice: "Balanced nutrition.",
    expectedRecoveryTime: "10 days"
  },
  "Northern Leaf Blight": {
    severity: "High",
    symptoms: ["Cigar-shaped grayish-green lesions on leaves"],
    cause: "Exserohilum turcicum",
    organicTreatment: "Tillage to bury residue",
    recommendedPesticides: ["Opera", "Abacus"],
    activeIngredient: "Pyraclostrobin + Epoxiconazole",
    dosePerLitre: "1.5 ml per litre of water",
    recommendedFungicideInsecticide: "Opera",
    prevention: ["Crop rotation", "Weed control"],
    irrigationAdvice: "Standard field irrigation.",
    fertilizerAdvice: "Balanced NPK.",
    expectedRecoveryTime: "1-2 weeks"
  },

  // Grape
  "Black Measles (Esca)": {
    severity: "Critical",
    symptoms: ["Tiger-stripe pattern on leaves", "Dark spots on berries"],
    cause: "Fungal complex (Phaeomoniella, Phaeoacremonium)",
    organicTreatment: "Pruning and wound protection",
    recommendedPesticides: ["No highly effective chemical cure. Focus on prevention."],
    activeIngredient: "Wound sealants with fungicides",
    dosePerLitre: "Apply as paste to pruning wounds",
    recommendedFungicideInsecticide: "Bordeaux mixture for protection",
    prevention: ["Avoid pruning in wet weather", "Sanitize tools"],
    irrigationAdvice: "Avoid water stress.",
    fertilizerAdvice: "Maintain vine vigor.",
    expectedRecoveryTime: "Long term management required"
  },
  "Leaf Blight (Isariopsis Leaf Spot)": {
    severity: "Moderate",
    symptoms: ["Irregular dark lesions on leaves", "Premature defoliation"],
    cause: "Pseudocercospora vitis",
    organicTreatment: "Copper oxychloride",
    recommendedPesticides: ["Blitox", "Kavach"],
    activeIngredient: "Copper Oxychloride 50% WP",
    dosePerLitre: "2-3 grams per litre of water",
    recommendedFungicideInsecticide: "Blitox",
    prevention: ["Collect and burn fallen leaves", "Canopy management"],
    irrigationAdvice: "Keep canopy dry.",
    fertilizerAdvice: "Standard vineyard fertilization.",
    expectedRecoveryTime: "7-10 days"
  },

  // Citrus
  "Citrus Greening (Huanglongbing)": {
    severity: "Critical",
    symptoms: ["Yellow shoots", "Mottled leaves", "Small, misshapen, bitter fruits"],
    cause: "Candidatus Liberibacter (Bacterium spread by Psyllids)",
    organicTreatment: "Remove infected trees. Spray Neem oil to control psyllids.",
    recommendedPesticides: ["Confidor", "Actara (To control vectors)"],
    activeIngredient: "Imidacloprid 17.8% SL",
    dosePerLitre: "0.5 ml per litre of water",
    recommendedFungicideInsecticide: "Confidor",
    prevention: ["Plant certified disease-free trees", "Control Asian Citrus Psyllid"],
    irrigationAdvice: "Maintain optimal moisture to reduce stress.",
    fertilizerAdvice: "Foliar nutritional sprays containing zinc and boron.",
    expectedRecoveryTime: "Incurable. Infected trees must be destroyed."
  },

  // Peach & Pepper & Tomato
  "Bacterial Spot": {
    severity: "High",
    symptoms: ["Water-soaked spots on leaves", "Shot-hole appearance on leaves", "Dark scabs on fruit"],
    cause: "Xanthomonas campestris pv. vesicatoria",
    organicTreatment: "Copper-based sprays, avoiding working in wet fields",
    recommendedPesticides: ["Blitox", "Kocide"],
    activeIngredient: "Copper Hydroxide or Copper Oxychloride",
    dosePerLitre: "2.5 grams per litre of water",
    recommendedFungicideInsecticide: "Kocide",
    prevention: ["Use pathogen-free seed", "Crop rotation"],
    irrigationAdvice: "Use drip irrigation. Avoid splashing.",
    fertilizerAdvice: "Avoid excessive nitrogen which promotes susceptible soft growth.",
    expectedRecoveryTime: "7-14 days for new growth"
  },

  // Potato & Tomato
  "Early Blight": {
    severity: "Moderate to High",
    symptoms: ["Brown spots with concentric rings (bulls-eye)", "Yellowing of lower leaves"],
    cause: "Alternaria solani fungus",
    organicTreatment: "Neem oil extract, Copper-based fungicides",
    recommendedPesticides: ["Indofil M-45", "Kavach", "Score"],
    activeIngredient: "Mancozeb 75% WP",
    dosePerLitre: "2-2.5 grams per litre of water",
    recommendedFungicideInsecticide: "Indofil M-45",
    prevention: ["Ensure proper spacing", "Crop rotation with non-solanaceous crops"],
    irrigationAdvice: "Drip irrigation recommended. Avoid overhead watering.",
    fertilizerAdvice: "Ensure adequate Potassium (K) levels.",
    expectedRecoveryTime: "7-14 days"
  },
  "Late Blight": {
    severity: "Critical",
    symptoms: ["Pale green, water-soaked spots", "White fuzzy growth on leaf undersides", "Rapid rot"],
    cause: "Phytophthora infestans (Oomycete)",
    organicTreatment: "Remove and destroy infected plants immediately. Preventative copper sprays.",
    recommendedPesticides: ["Ridomil Gold", "Curzate", "Acrobat"],
    activeIngredient: "Metalaxyl 8% + Mancozeb 64% WP",
    dosePerLitre: "2.5 grams per litre of water",
    recommendedFungicideInsecticide: "Ridomil Gold",
    prevention: ["Plant resistant varieties", "Avoid planting near infected fields"],
    irrigationAdvice: "Strictly avoid overhead irrigation.",
    fertilizerAdvice: "Maintain balanced nutrition.",
    expectedRecoveryTime: "Difficult to recover if severe; requires immediate action."
  },
  "Septoria Leaf Spot": {
    severity: "Moderate",
    symptoms: ["Numerous small, circular spots with dark borders and gray centers", "Defoliation starting from bottom"],
    cause: "Septoria lycopersici",
    organicTreatment: "Remove affected leaves, Copper fungicides",
    recommendedPesticides: ["Kavach", "Blitox"],
    activeIngredient: "Chlorothalonil 75% WP",
    dosePerLitre: "2 grams per litre of water",
    recommendedFungicideInsecticide: "Kavach",
    prevention: ["Mulch to prevent soil splash", "Staking plants"],
    irrigationAdvice: "Water at the base only.",
    fertilizerAdvice: "Apply balanced NPK.",
    expectedRecoveryTime: "1-2 weeks"
  },
  "Spider Mites": {
    severity: "High",
    symptoms: ["Tiny yellow or white speckles on leaves", "Fine webbing on undersides of leaves", "Leaves turn bronze/yellow"],
    cause: "Tetranychus urticae",
    organicTreatment: "Neem oil, Insecticidal soap, Introduce predatory mites",
    recommendedPesticides: ["Oberon", "Omite", "Magister"],
    activeIngredient: "Spiromesifen 22.9% SC or Propargite 57% EC",
    dosePerLitre: "1-1.5 ml per litre of water",
    recommendedFungicideInsecticide: "Oberon (Acaricide)",
    prevention: ["Keep plants well-watered (mites love dry, dusty conditions)", "Clear weeds"],
    irrigationAdvice: "Overhead watering occasionally can help wash off mites.",
    fertilizerAdvice: "Avoid excess nitrogen.",
    expectedRecoveryTime: "1-2 weeks"
  },
  "Target Spot": {
    severity: "Moderate",
    symptoms: ["Dark brown spots with faint concentric rings", "Spots may merge causing blighting"],
    cause: "Corynespora cassiicola",
    organicTreatment: "Improve airflow, preventative copper sprays",
    recommendedPesticides: ["Amistar", "Score"],
    activeIngredient: "Azoxystrobin 23% SC",
    dosePerLitre: "1 ml per litre of water",
    recommendedFungicideInsecticide: "Amistar",
    prevention: ["Avoid dense planting", "Prune lower leaves"],
    irrigationAdvice: "Drip irrigation.",
    fertilizerAdvice: "Balanced nutrition.",
    expectedRecoveryTime: "7-10 days"
  },
  "Tomato Yellow Leaf Curl Virus": {
    severity: "Critical",
    symptoms: ["Upward curling of leaves", "Yellowing (chlorosis) of leaf margins", "Stunted plant growth", "Flower drop"],
    cause: "Begomovirus (transmitted by Whiteflies)",
    organicTreatment: "Remove and destroy infected plants immediately. Neem oil to control whiteflies.",
    recommendedPesticides: ["Confidor", "Pegasus", "Pride"],
    activeIngredient: "Imidacloprid 17.8% SL or Diafenthiuron 50% WP (Vector control)",
    dosePerLitre: "0.5 ml - 1 gram per litre of water",
    recommendedFungicideInsecticide: "Confidor (for whitefly control)",
    prevention: ["Plant resistant varieties (e.g., TYLCV-resistant)", "Use yellow sticky traps", "Reflective mulches"],
    irrigationAdvice: "Maintain regular watering to avoid stress.",
    fertilizerAdvice: "Avoid excess nitrogen which attracts whiteflies.",
    expectedRecoveryTime: "Incurable. Infected plants must be destroyed."
  },
  "Tomato Mosaic Virus": {
    severity: "High",
    symptoms: ["Mottling and mosaic pattern on leaves", "Fern-like or string-like leaves", "Stunted growth"],
    cause: "Tobamovirus (mechanically transmitted)",
    organicTreatment: "No cure. Eradicate infected plants. Wash hands with soap and milk.",
    recommendedPesticides: ["None (Viruses cannot be cured chemically)"],
    activeIngredient: "N/A",
    dosePerLitre: "N/A",
    recommendedFungicideInsecticide: "N/A",
    prevention: ["Use certified disease-free seeds", "Do not smoke near plants (tobacco virus transfer)", "Sanitize tools with bleach"],
    irrigationAdvice: "Standard irrigation.",
    fertilizerAdvice: "Standard nutrition.",
    expectedRecoveryTime: "Incurable. Destroy plants."
  },
  "Leaf Mold": {
    severity: "Moderate",
    symptoms: ["Pale green or yellow spots on upper leaf", "Olive-green to brown velvety mold on lower leaf"],
    cause: "Passalora fulva fungus",
    organicTreatment: "Improve ventilation, Copper fungicide",
    recommendedPesticides: ["Kavach", "Contaf"],
    activeIngredient: "Chlorothalonil 75% WP or Hexaconazole",
    dosePerLitre: "2 grams per litre of water",
    recommendedFungicideInsecticide: "Kavach",
    prevention: ["Increase spacing", "Prune for better air circulation in greenhouses"],
    irrigationAdvice: "Water early in the day.",
    fertilizerAdvice: "Avoid excessive canopy growth.",
    expectedRecoveryTime: "1-2 weeks"
  },

  // Generic Categories
  "Healthy": {
    severity: "None",
    symptoms: ["No visible signs of disease", "Leaves are green and intact"],
    cause: "N/A",
    organicTreatment: "Continue standard maintenance",
    recommendedPesticides: ["None required"],
    activeIngredient: "N/A",
    dosePerLitre: "N/A",
    recommendedFungicideInsecticide: "N/A",
    prevention: ["Maintain regular watering schedule", "Monitor for pests weekly"],
    irrigationAdvice: "Follow standard seasonal irrigation protocols.",
    fertilizerAdvice: "Apply balanced NPK as per crop stage.",
    expectedRecoveryTime: "N/A"
  }
};

export function getDiseaseMapping(diseaseString: string) {
  const dStr = diseaseString.toLowerCase();
  
  if (dStr.includes("healthy")) return diseaseDatabase["Healthy"];
  if (dStr.includes("apple scab")) return diseaseDatabase["Apple Scab"];
  if (dStr.includes("black rot")) return diseaseDatabase["Apple Black Rot"];
  if (dStr.includes("cedar apple rust")) return diseaseDatabase["Cedar Apple Rust"];
  if (dStr.includes("cercospora") || dStr.includes("gray leaf spot")) return diseaseDatabase["Cercospora Leaf Spot (Gray Leaf Spot)"];
  if (dStr.includes("common rust")) return diseaseDatabase["Common Rust"];
  if (dStr.includes("northern leaf blight")) return diseaseDatabase["Northern Leaf Blight"];
  if (dStr.includes("esca") || dStr.includes("measles")) return diseaseDatabase["Black Measles (Esca)"];
  if (dStr.includes("isariopsis") || dStr.includes("leaf blight")) return diseaseDatabase["Leaf Blight (Isariopsis Leaf Spot)"];
  if (dStr.includes("haunglongbing") || dStr.includes("greening")) return diseaseDatabase["Citrus Greening (Huanglongbing)"];
  if (dStr.includes("bacterial spot")) return diseaseDatabase["Bacterial Spot"];
  if (dStr.includes("early blight")) return diseaseDatabase["Early Blight"];
  if (dStr.includes("late blight")) return diseaseDatabase["Late Blight"];
  if (dStr.includes("powdery mildew")) return diseaseDatabase["Powdery Mildew"];
  if (dStr.includes("septoria")) return diseaseDatabase["Septoria Leaf Spot"];
  if (dStr.includes("spider mite") || dStr.includes("mites")) return diseaseDatabase["Spider Mites"];
  if (dStr.includes("target spot")) return diseaseDatabase["Target Spot"];
  if (dStr.includes("yellow leaf curl")) return diseaseDatabase["Tomato Yellow Leaf Curl Virus"];
  if (dStr.includes("mosaic virus")) return diseaseDatabase["Tomato Mosaic Virus"];
  if (dStr.includes("leaf mold")) return diseaseDatabase["Leaf Mold"];
  if (dStr.includes("leaf scorch")) return diseaseDatabase["Leaf Blight (Isariopsis Leaf Spot)"]; // close enough fallback
  if (dStr.includes("spot")) return diseaseDatabase["Bacterial Spot"]; // generic spot fallback
  
  // Generic Fallback for entirely unknown diseases
  return {
    severity: "Unknown",
    symptoms: ["Unidentified visual anomalies. Comprehensive inspection required."],
    cause: "Unknown pathogen (" + diseaseString + ")",
    organicTreatment: "Isolate affected plants immediately. Apply broad-spectrum Neem oil (10,000 PPM) at 3ml/L.",
    recommendedPesticides: ["Consult a local agricultural expert for accurate chemical diagnosis."],
    activeIngredient: "Broad-spectrum Fungicide/Bactericide",
    dosePerLitre: "Follow manufacturer instructions",
    recommendedFungicideInsecticide: "Mancozeb 75% WP (General Purpose)",
    prevention: ["Ensure proper field sanitation", "Monitor closely for spreading", "Avoid overwatering"],
    irrigationAdvice: "Maintain optimal soil moisture without waterlogging. Keep foliage dry.",
    fertilizerAdvice: "Maintain balanced nutrition. Do not apply excess nitrogen to stressed plants.",
    expectedRecoveryTime: "Unknown; monitor weekly."
  };
}
