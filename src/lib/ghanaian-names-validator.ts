// Ghanaian Names Validation Service
// Comprehensive database and validation for authentic Ghanaian names

export interface NameValidationResult {
    isValid: boolean;
    confidence: number;
    suggestedName?: string;
    nameType?: "day-name" | "traditional" | "modern" | "surname";
    meaning?: string;
    alternatives?: string[];
  }
  
  // Comprehensive database of authentic Ghanaian names
  const GHANAIAN_NAMES_DATABASE = {
    // Day Names (Kra Din) - Male
    dayNames: {
      male: {
        monday: ["Kojo", "Kwadwo", "Kodwo"],
        tuesday: ["Kwabena", "Kobena", "Kobina"],
        wednesday: ["Kwaku", "Kweku"],
        thursday: ["Yaw", "Yao"],
        friday: ["Kofi"],
        saturday: ["Kwame", "Kwamena"],
        sunday: ["Kwasi", "Kwesi"]
      },
      female: {
        monday: ["Adwoa", "Adjoa", "Adjua", "Adzo"],
        tuesday: ["Abena", "Abenaa", "Abina"],
        wednesday: ["Akua", "Ekua"],
        thursday: ["Yaa", "Aba"],
        friday: ["Afia", "Afua", "Efua", "Efia"],
        saturday: ["Ama", "Mama"],
        sunday: ["Akosua", "Akos"]
      }
    },
    
    // Traditional Names (Din Pa) - Male
    traditionalMale: [
      "Aboagye", "Acheampong", "Addae", "Adekorafo", "Adwenpa", "Agyei", "Agyenim", "Agymah",
      "Bediako", "Botwe", "Bubune", "Coblah", "Commie", "Danquah", "Danso", "Dodzi", "Dziedzorm",
      "Ebo", "Ekow", "Elikplim", "Elolo", "Kaatachi", "Kafui", "Klenam", "Kplorm", "Madonudenu",
      "Makafui", "Manorgbe", "Mawufeasi", "Mawuli", "Nkrumah", "Osei", "Essien", "Berko", "Mensa",
      "Pra", "Abam", "Abeeku", "Abronoma", "Adekorafo", "Adjo", "Afuom", "Agyei", "Agyenim",
      "Bediako", "Botwe", "Bubune", "Coblah", "Commie", "Danquah", "Danso", "Dodzi", "Dziedzorm",
      "Ebo", "Ekow", "Elikplim", "Elolo", "Kaatachi", "Kafui", "Klenam", "Kplorm", "Madonudenu",
      "Makafui", "Manorgbe", "Mawufeasi", "Mawuli", "Nkrumah", "Osei", "Essien", "Berko", "Mensa",
      "Pra", "Baako", "Nana", "Kofi", "Kwame", "Yaw", "Kojo", "Kwabena", "Kwaku", "Kwasi"
    ],
    
    // Traditional Names (Din Pa) - Female
    traditionalFemale: [
      "Abena", "Afia", "Ama", "Akosua", "Adwoa", "Akua", "Efua", "Yaa", "Aba", "Adjoa", "Mama",
      "Afi", "Atta", "Abraha", "Aku", "Anan", "Efia", "Ekua", "Nipa", "Thema", "Abam", "Abeeku",
      "Abina", "Aboagye", "Abronoma", "Acheampong", "Addae", "Adekorafo", "Adwenpa", "Agyei",
      "Agyenim", "Agymah", "Bediako", "Botwe", "Bubune", "Coblah", "Commie", "Danquah", "Danso",
      "Dodzi", "Dziedzorm", "Ebo", "Ekow", "Elikplim", "Elolo", "Kaatachi", "Kafui", "Klenam",
      "Kplorm", "Madonudenu", "Makafui", "Manorgbe", "Mawufeasi", "Mawuli", "Nkrumah", "Osei",
      "Essien", "Berko", "Mensa", "Pra", "Nhyira", "Wafaa", "Mizani", "Atu", "Do", "Lahari",
      "Ababio", "Abam", "Abeeku", "Abina", "Aboagye", "Abronoma", "Acheampong", "Addae", "Adekorafo",
      "Adwenpa", "Agyei", "Agyenim", "Agymah", "Bediako", "Botwe", "Bubune", "Coblah", "Commie",
      "Danquah", "Danso", "Dodzi", "Dziedzorm", "Ebo", "Ekow", "Elikplim", "Elolo", "Kaatachi",
      "Kafui", "Klenam", "Kplorm", "Madonudenu", "Makafui", "Manorgbe", "Mawufeasi", "Mawuli",
      "Nkrumah", "Osei", "Essien", "Berko", "Mensa", "Pra", "Nhyira", "Wafaa", "Mizani", "Atu",
      "Do", "Lahari", "Ababio", "Afafa", "Afryea", "Afuom", "Agyei", "Agyenim", "Agymah", "Bediako",
      "Botwe", "Bubune", "Coblah", "Commie", "Danquah", "Danso", "Dodzi", "Dziedzorm", "Ebo",
      "Ekow", "Elikplim", "Elolo", "Kaatachi", "Kafui", "Klenam", "Kplorm", "Madonudenu", "Makafui",
      "Manorgbe", "Mawufeasi", "Mawuli", "Nkrumah", "Osei", "Essien", "Berko", "Mensa", "Pra"
    ],
    
    // Common Surnames
    surnames: [
      "Acheampong", "Adjei", "Agyei", "Agyemang", "Amoah", "Antwi", "Asante", "Asiedu", "Boateng",
      "Bonsu", "Darko", "Frimpong", "Gyasi", "Kwarteng", "Mensah", "Nkrumah", "Ofori", "Osei",
      "Owusu", "Prempeh", "Sarpong", "Tetteh", "Yeboah", "Aboagye", "Addae", "Adekorafo", "Adwenpa",
      "Agyenim", "Agymah", "Bediako", "Botwe", "Bubune", "Coblah", "Commie", "Danquah", "Danso",
      "Dodzi", "Dziedzorm", "Ebo", "Ekow", "Elikplim", "Elolo", "Kaatachi", "Kafui", "Klenam",
      "Kplorm", "Madonudenu", "Makafui", "Manorgbe", "Mawufeasi", "Mawuli", "Nkrumah", "Osei",
      "Essien", "Berko", "Mensa", "Pra", "Nhyira", "Wafaa", "Mizani", "Atu", "Do", "Lahari",
      "Ababio", "Afafa", "Afryea", "Afuom", "Agyei", "Agyenim", "Agymah", "Bediako", "Botwe",
      "Bubune", "Coblah", "Commie", "Danquah", "Danso", "Dodzi", "Dziedzorm", "Ebo", "Ekow",
      "Elikplim", "Elolo", "Kaatachi", "Kafui", "Klenam", "Kplorm", "Madonudenu", "Makafui",
      "Manorgbe", "Mawufeasi", "Mawuli", "Nkrumah", "Osei", "Essien", "Berko", "Mensa", "Pra"
    ]
  };
  
  // Name patterns for validation
  const GHANAIAN_NAME_PATTERNS = {
    // Common prefixes in Ghanaian names
    prefixes: ["A", "E", "K", "O", "N", "M", "B", "D", "S", "T", "Y"],
    
    // Common suffixes in Ghanaian names
    suffixes: ["a", "e", "i", "o", "u", "aa", "ee", "ii", "oo", "uu", "ei", "ai", "ao", "au"],
    
    // Common letter combinations
    letterCombinations: ["kw", "gy", "ky", "ny", "tw", "dw", "bw", "fw", "hw", "sw", "tw", "yw"],
    
    // Vowel patterns common in Ghanaian names
    vowelPatterns: [/^[AEIOU]/, /[AEIOU]$/, /[AEIOU]{2,}/, /[AEIOU][^AEIOU][AEIOU]/]
  };
  
  export class GhanaianNamesValidator {
    
    // Check if a name exists in our database
    private isInDatabase(name: string): boolean {
      const normalizedName = name.toLowerCase().trim();
      
      // Check all name categories
      const allNames = [
        ...Object.values(GHANAIAN_NAMES_DATABASE.dayNames.male).flat(),
        ...Object.values(GHANAIAN_NAMES_DATABASE.dayNames.female).flat(),
        ...GHANAIAN_NAMES_DATABASE.traditionalMale,
        ...GHANAIAN_NAMES_DATABASE.traditionalFemale,
        ...GHANAIAN_NAMES_DATABASE.surnames
      ].map(n => n.toLowerCase());
      
      return allNames.includes(normalizedName);
    }
    
    // Find similar names using fuzzy matching
    private findSimilarNames(name: string, threshold: number = 0.7): string[] {
      const normalizedName = name.toLowerCase().trim();
      const allNames = [
        ...Object.values(GHANAIAN_NAMES_DATABASE.dayNames.male).flat(),
        ...Object.values(GHANAIAN_NAMES_DATABASE.dayNames.female).flat(),
        ...GHANAIAN_NAMES_DATABASE.traditionalMale,
        ...GHANAIAN_NAMES_DATABASE.traditionalFemale
      ];
      
      const similarNames: { name: string; similarity: number }[] = [];
      
      for (const dbName of allNames) {
        const similarity = this.calculateSimilarity(normalizedName, dbName.toLowerCase());
        if (similarity >= threshold) {
          similarNames.push({ name: dbName, similarity });
        }
      }
      
      return similarNames
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)
        .map(item => item.name);
    }
    
    // Calculate similarity between two strings (Levenshtein distance)
    private calculateSimilarity(str1: string, str2: string): number {
      const maxLength = Math.max(str1.length, str2.length);
      if (maxLength === 0) return 1.0;
      
      const distance = this.levenshteinDistance(str1, str2);
      return 1 - (distance / maxLength);
    }
    
    // Levenshtein distance calculation
    private levenshteinDistance(str1: string, str2: string): number {
      const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
      
      for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
      for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
      
      for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1,     // deletion
            matrix[j - 1][i] + 1,     // insertion
            matrix[j - 1][i - 1] + indicator // substitution
          );
        }
      }
      
      return matrix[str2.length][str1.length];
    }
    
    // Check if name follows Ghanaian naming patterns
    private followsGhanaianPatterns(name: string): boolean {
      const normalizedName = name.toLowerCase().trim();
      
      // Check if it starts with common Ghanaian prefixes
      const startsWithPrefix = GHANAIAN_NAME_PATTERNS.prefixes.some(prefix => 
        normalizedName.startsWith(prefix.toLowerCase())
      );
      
      // Check if it contains common letter combinations
      const hasLetterCombination = GHANAIAN_NAME_PATTERNS.letterCombinations.some(combo => 
        normalizedName.includes(combo)
      );
      
      // Check vowel patterns
      const hasVowelPattern = GHANAIAN_NAME_PATTERNS.vowelPatterns.some(pattern => 
        pattern.test(normalizedName)
      );
      
      // Check length (Ghanaian names are typically 3-12 characters)
      const hasValidLength = normalizedName.length >= 2 && normalizedName.length <= 15;
      
      return (startsWithPrefix || hasLetterCombination || hasVowelPattern) && hasValidLength;
    }
    
    // Determine name type
    private determineNameType(name: string): "day-name" | "traditional" | "modern" | "surname" {
      const normalizedName = name.toLowerCase().trim();
      
      // Check if it's a day name
      const allDayNames = [
        ...Object.values(GHANAIAN_NAMES_DATABASE.dayNames.male).flat(),
        ...Object.values(GHANAIAN_NAMES_DATABASE.dayNames.female).flat()
      ].map(n => n.toLowerCase());
      
      if (allDayNames.includes(normalizedName)) {
        return "day-name";
      }
      
      // Check if it's a surname
      if (GHANAIAN_NAMES_DATABASE.surnames.map(n => n.toLowerCase()).includes(normalizedName)) {
        return "surname";
      }
      
      // Check if it's traditional
      const allTraditionalNames = [
        ...GHANAIAN_NAMES_DATABASE.traditionalMale,
        ...GHANAIAN_NAMES_DATABASE.traditionalFemale
      ].map(n => n.toLowerCase());
      
      if (allTraditionalNames.includes(normalizedName)) {
        return "traditional";
      }
      
      return "modern";
    }
    
    // Get name meaning (simplified)
    private getNameMeaning(name: string): string {
      const normalizedName = name.toLowerCase().trim();
      
      // Day name meanings
      const dayMeanings: { [key: string]: string } = {
        "kojo": "Born on Monday",
        "kwadwo": "Born on Monday", 
        "kwabena": "Born on Tuesday",
        "kwaku": "Born on Wednesday",
        "yaw": "Born on Thursday",
        "kofi": "Born on Friday",
        "kwame": "Born on Saturday",
        "kwasi": "Born on Sunday",
        "adwoa": "Born on Monday",
        "abena": "Born on Tuesday",
        "akua": "Born on Wednesday",
        "yaa": "Born on Thursday",
        "afia": "Born on Friday",
        "ama": "Born on Saturday",
        "akosua": "Born on Sunday"
      };
      
      return dayMeanings[normalizedName] || "Traditional Ghanaian name";
    }
    
    // Main validation method
    validateName(name: string): NameValidationResult {
      const normalizedName = name.trim();
      
      if (!normalizedName || normalizedName.length < 2) {
        return {
          isValid: false,
          confidence: 0,
          suggestedName: undefined,
          nameType: undefined,
          meaning: undefined,
          alternatives: []
        };
      }
      
      // Check if name is in database
      const isInDB = this.isInDatabase(normalizedName);
      
      // Check if it follows Ghanaian patterns
      const followsPatterns = this.followsGhanaianPatterns(normalizedName);
      
      // Calculate confidence
      let confidence = 0;
      if (isInDB) {
        confidence = 0.9; // High confidence if in database
      } else if (followsPatterns) {
        confidence = 0.6; // Medium confidence if follows patterns
      } else {
        confidence = 0.2; // Low confidence
      }
      
      // Find similar names if not exact match
      const alternatives = isInDB ? [] : this.findSimilarNames(normalizedName, 0.6);
      
      // Determine name type
      const nameType = this.determineNameType(normalizedName);
      
      // Get meaning
      const meaning = this.getNameMeaning(normalizedName);
      
      return {
        isValid: isInDB || followsPatterns,
        confidence,
        suggestedName: alternatives.length > 0 ? alternatives[0] : undefined,
        nameType,
        meaning,
        alternatives: alternatives.slice(0, 3)
      };
    }
  }
  
  export const ghanaianNamesValidator = new GhanaianNamesValidator();