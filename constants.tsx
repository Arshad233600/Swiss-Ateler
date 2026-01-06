
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: {
      de: 'Bern Kaschmir-Mantel',
      fr: 'Manteau en Cachemire Bern',
      it: 'Cappotto in Cashmere Bern',
      fa: 'پالتو کشمیر برن'
    },
    price: 1250,
    // Added missing required properties for Product type
    stock: 5,
    isActive: true,
    isNew: true,
    category: 'Men',
    description: {
      de: 'Ein schwerer, architektonischer Mantel aus feinstem mongolischem Kaschmir.',
      fr: 'Un manteau architectural lourd, fabriqué à partir du meilleur cachemire.',
      it: 'Un cappotto architettonico pesante, realizzato con il miglior cashmere.',
      fa: 'پالتویی سنگین و معماری‌گونه، ساخته شده از مرغوب‌ترین کشمیر مغولستان.'
    },
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: ['Charcoal', 'Midnight Blue'],
    sizes: ['EU 48', 'EU 50', 'EU 52', 'EU 54'],
    featured: true,
    sellerTrustScore: 98,
    reviews: [
      {
        id: 'r1',
        author: 'Marc S.',
        rating: 5,
        date: '2024-01-12',
        isVerifiedPurchase: true,
        comment: {
          de: 'Hervorragende Qualität. Die Passform ist perfekt.',
          fr: 'Qualité exceptionnelle. La coupe est parfaite.',
          it: 'Qualità eccezionale. La vestibilità est perfetta.',
          fa: 'کیفیت فوق‌العاده است. تن‌خور لباس کاملاً بی‌نقص می‌باشد.'
        }
      }
    ]
  },
  {
    id: 'w4',
    name: {
      fa: 'ژاکت پشمی مرینوس آلپ',
      de: 'Alpin-Merinowolljacke',
      fr: 'Veste en Laine Mérinos Alpine',
      it: 'Giacca in Lana Merino Alpina'
    },
    price: 980,
    // Added missing required properties for Product type
    stock: 12,
    isActive: true,
    isNew: true,
    category: 'Women',
    featured: true,
    description: {
      fa: 'بافت ظریف از پشم مرینوس ارگانیک با جزئیات دکمه‌های نقره‌ای سوئیسی.',
      de: 'Feiner Strick aus Bio-Merinowolle mit Schweizer Silberknöpfen.',
      fr: 'Maille fine en laine mérinos biologique avec boutons en argent suisse.',
      it: 'Maglia fine in lana merino biologica con bottoni in argento svizzero.'
    },
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: ['Oatmeal', 'Soft Grey'],
    sizes: ['XS', 'S', 'M', 'L'],
    sellerTrustScore: 100
  },
  {
    id: 'a2',
    name: {
      fa: 'چمدان مسافرتی ابسیدین',
      de: 'Obsidian Reisekoffer',
      fr: 'Malle de Voyage Obsidienne',
      it: 'Baule da Viaggio Ossidiana'
    },
    price: 3400,
    // Added missing required properties for Product type
    stock: 3,
    isActive: true,
    isNew: true,
    category: 'Accessories',
    featured: true,
    description: {
      fa: 'بدنه فیبر کربن تقویت شده با قفل‌های بیومتریک و طراحی فوق‌العاده سبک.',
      de: 'Kohlefasergehäuse mit biometrischen Schlössern und ultraleichtem Design.',
      fr: 'Boîtier en fibre de carbone avec serrures biométriques.',
      it: 'Involucro in fibra di carbonio con serrature biometriche.'
    },
    images: [
      'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: ['Stealth Black'],
    sizes: ['Cabin Size', 'Check-in'],
    sellerTrustScore: 99
  },
  {
    id: 'm2',
    name: {
      fa: 'ژاکت تکنیکال آلپاین',
      de: 'Alpine Tech-Jacke',
      fr: 'Veste Technique Alpine',
      it: 'Giacca Tecnica Alpina'
    },
    price: 890,
    // Added missing required properties for Product type
    stock: 15,
    isActive: true,
    isNew: true,
    category: 'Men',
    description: {
      fa: 'لایه محافظ سه لایه با قابلیت تنفس بالا و مقاومت در برابر طوفان‌های آلپ.',
      de: 'Dreilagige Schutzschicht, hoch atmungsaktiv und sturmfest.',
      fr: 'Couche de protection à trois couches, hautement respirante.',
      it: 'Strato protettivo a tre strati, altamente traspirante.'
    },
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: ['Stealth Black', 'Glacier White'],
    sizes: ['M', 'L', 'XL'],
    sellerTrustScore: 92
  },
  {
    id: 'w1',
    name: {
      de: 'Genfer Seidenkleid',
      fr: 'Robe en Soie de Genève',
      it: 'Abito in Seta di Ginevra',
      fa: 'لباس ابریشمی ژنو'
    },
    price: 1450,
    // Added missing required properties for Product type
    stock: 8,
    isActive: true,
    isNew: true,
    category: 'Women',
    description: {
      fa: 'سیلوئت روان و معماری‌گونه از ابریشم سنگین سوئیسی.',
      de: 'Fließende architektonische Silhouette aus schwerer Schweizer Seide.',
      fr: 'Silhouette architecturale fluide en soie suisse lourde.',
      it: 'Silhouette architettonica fluida in pesante seta svizera.'
    },
    images: [
      'https://images.unsplash.com/photo-1539109132381-315125a0b503?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: ['Ivory', 'Onyx'],
    sizes: ['FR 34', 'FR 36', 'FR 38', 'FR 40'],
    featured: true,
    sellerTrustScore: 100
  },
  {
    id: 'm5',
    name: {
      fa: 'کت چرمی تیتان',
      de: 'Titan-Lederjacke',
      fr: 'Veste en Cuir Titan',
      it: 'Giacca in Pelle Titan'
    },
    price: 1850,
    // Added missing required properties for Product type
    stock: 4,
    isActive: true,
    isNew: true,
    category: 'Men',
    featured: true,
    description: {
      fa: 'چرم گاومیش دباغی شده با گیاه، مقاوم در برابر سایش با آستر ابریشم سرد.',
      de: 'Pflanzlich gegerbtes Büffelleder, abriebfest mit Kaltseidenfutter.',
      fr: 'Cuir de buffle à tannage végétal, résistant à l\'abrasion.',
      it: 'Pelle di bufalo a concia vegetale, resistente all\'abrasione.'
    },
    images: [
      'https://images.unsplash.com/photo-1520975916090-3105956dac50?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: ['Deep Brown', 'Obsidian'],
    sizes: ['EU 48', 'EU 50', 'EU 52'],
    sellerTrustScore: 96
  },
  {
    id: 'a1',
    name: {
      de: 'Zürcher Chronometer',
      fr: 'Chronomètre de Zurich',
      it: 'Cronometro di Zurigo',
      fa: 'کرونومتر زوریخ'
    },
    price: 4200,
    // Added missing required properties for Product type
    stock: 2,
    isActive: true,
    isNew: true,
    category: 'Accessories',
    description: {
      fa: 'موتور بسیار دقیق با شیشه یاقوت کبود و بدنه تیتانیوم برس‌خورده.',
      de: 'Präzisionsuhrwerk mit Saphirglas und Gehäuse aus gebürstetem Titan.',
      fr: 'Mouvement de précision avec verre saphir und boîtier en titane brossé.',
      it: 'Movimento di precisione con vetro zaffiro e cassa in titanio spazzolato.'
    },
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: ['Titanium', 'Matte Black'],
    sizes: ['40mm', '42mm'],
    featured: true,
    sellerTrustScore: 99
  }
];

export const GARMENT_TYPES = ['Men', 'Women', 'Kids', 'Accessories'];
export const ALL_CATEGORIES = ['All', ...GARMENT_TYPES];
