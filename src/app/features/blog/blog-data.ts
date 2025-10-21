// blog-data.ts

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;  // Must be a string from CATEGORIES
  tags: string[];    // An array of strings from TAGS
}

export const CATEGORIES: string[] = [
  'MIRËMBAJTJE',
  'MODERNIZIM, SHËRBIM & RIPARIM',
  'SIGURI',
  'TEKNOLOGJI'
];

export const TAGS: string[] = [
  'ADA PAJTUESHMËRIA',
  'ASHENSOR',
  'KOMUNIKIM',
  'EFIKASITETI',
  'SIGURIA NGA ZJARRI',
  'INSPEKTIM'
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Mirëmbajtja e Ashensorëve: Gjithçka që Duhet të Dini',
    slug: 'mirembajtja-e-ashensoreve',
    excerpt: 'Mësoni pse mirëmbajtja e rregullt është thelbësore për sigurinë dhe jetëgjatësinë e ashensorëve.',
    content: `
      <p>Mirëmbajtja e rregullt e ashensorëve nuk është thjesht një kërkesë ligjore, por një investim thelbësor në sigurinë dhe funksionimin e ndërtesës suaj.</p>
      <h3>Pse është e nevojshme?</h3>
      <p>Pa kontrolle mujore, komponentët jetikë mund të konsumohen pa u vënë re. Kjo çon në ndërprerje të shërbimit dhe, më e rëndësishmja, në rrezikshmëri për pasagjerët.</p>
      <ul>
        <li>Rrit jetëgjatësinë e pajisjeve.</li>
        <li>Ul koston e riparimeve emergjente.</li>
        <li>Siguron përputhje me standardet e sigurisë.</li>
      </ul>
      <p>Allied Elevator ofron plane mirëmbajtjeje të personalizuara për çdo lloj ashensori, duke garantuar funksionim të qetë dhe të besueshëm.</p>
    `,
    date: '2025-10-21',
    image: 'https://imgur.com/hdsgSi7.jpg',
    category: 'MIRËMBAJTJE',
    tags: ['ASHENSOR', 'EFIKASITETI']
  },

  // --- 2. NEW POST: CELULAR ELEVATOR PHONE UPGRADE ---
  {
    id: 2,
    title: 'Zgjidhja Celulare e Ashensorëve: Pse Është E Rëndësishme Të Zëvendësoni Linjat Analoge',
    slug: 'zgjidhja-celulare-e-ashensoreve',
    excerpt: 'Një buton emergjence brenda një ashensori është një mjet shpëtimi gjatë një krize. Por nëse është i lidhur me një sistem analog të vjetërsuar, ai mund të dështojë pikërisht kur nevojitet.',
    content: `
      <p class="text-lg font-medium text-gray-900 mb-6">Butoni i thirrjes emergjente brenda një ashensori është një mjet shpëtimi gjatë një krize. Por nëse është i lidhur me një sistem analog të vjetërsuar, ai mjet shpëtimi mund të dështojë pikërisht kur nevojitet më shumë. Me faza graduale të heqjes dorë nga linjat tokësore me bakër, ndërtesat duhet të kalojnë në sistemet celulare të telefonisë së ashensorëve për të ruajtur sigurinë, pajtueshmërinë dhe besueshmërinë e komunikimit.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Analog vs. Celular: Çfarë Duhet të Dinë Operatorët e Ndërtesave</h2>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li><strong>Telefonat analogë</strong> mbështeten në linjat tokësore me bakër, shumë prej të cilave po hiqen nga ofruesit e telekomit.</li>
        <li><strong>Telefonat celularë të ashensorit</strong> lidhen pa tela përmes një sistemi të fuqishëm, me bateri rezervë, të krijuar posaçërisht për përdorim urgjent.</li>
        <li><strong>Pajtueshmëria me kodin</strong> kërkon komunikim të besueshëm dhe sistemet e vjetra analoge mund të mos plotësojnë standardet e sotme.</li>
      </ul>

      <h2 class="text-2xl font-bold mt-8 mb-4">Përfitimet e Përmirësimit në Telefonat Celularë të Ashensorit</h2>
      <p>Kalimi nuk është vetëm një përmirësim teknik—është një rritje jetike e sigurisë:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Rritje e besueshmërisë edhe gjatë ndërprerjeve të energjisë</li>
        <li>Monitorim 24/7 dhe sinjalizime të menjëhershme nëse shërbimi ndërpritet</li>
        <li>Shfrytëzimi i shpejtësisë së rrjeteve moderne celulare për lidhje më të shpejtë të thirrjeve emergjente</li>
        <li>Kosto të reduktuara afatgjata ndërsa tarifat e linjave analoge rriten dhe kostot celulare bien</li>
        <li>Pajtueshmëri me kërkesat e ASME A17.1, IBC dhe ADA</li>
        <li>Shfrytëzon rrjetin celular LTE dhe përdor një telefon tradicional ADA hands-free në çdo kabinë ashensori</li>
      </ul>
      <p class="mt-4 border-l-4 border-red-500 pl-4 italic bg-gray-50 p-3 rounded-md">Ndërtesat që përdorin ende sisteme analoge të instaluara më shumë se një dekadë më parë janë në rrezik veçanërisht të lartë. Shumë pronarë mund të mos e kuptojnë që sistemi nuk është më funksional—derisa të jetë tepër vonë.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Çfarë Ndodh Nëse Nuk Përmirësoni?</h2>
      <p>Një telefon ashensori jo-funksional gjatë një emergjence e ekspozon ndërtesën ndaj:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Vonesave kërcënuese për jetën në shpëtim</li>
        <li>Rritjes së përgjegjësisë dhe dështimit të inspektimeve të sigurisë</li>
        <li>Ankesave të pasagjerëve dhe besimit të reduktuar në operacionet e ndërtesës</li>
      </ul>
      <p class="font-bold text-red-600">Modernizimi i komunikimit të ashensorit tuaj nuk është opsional—është urgjent.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Bëni Kalimin në një Sistem Celular Telefonik të Ashensorit</h2>
      <p>Lajmi i mirë: Përmirësimi është i drejtpërdrejtë kur bëhet me një partner me përvojë. Një ekip profesional do të merret me procesin e plotë:</p>
      <ol class="list-decimal list-inside space-y-2 ml-4">
        <li>Vlerësoni konfigurimin aktual të telefonit të ashensorit tuaj</li>
        <li>Rekomandoni sistemin e duhur celular për ndërtesën tuaj</li>
        <li>Instaloni, konfiguroni dhe testoni për të siguruar gatishmërinë</li>
        <li>Siguroni trajnim dhe mbështetje për stafin</li>
      </ol>
      <p class="mt-6">Komunikimi i besueshëm i ashensorit ka të bëjë me më shumë sesa rregulloret—ka të bëjë me sigurinë e çdo personi që hyn në ndërtesën tuaj.</p>
    `,
    date: '2025-10-21',
    image: 'https://imgur.com/hdsgSi7.jpg',
    category: 'SIGURIA',
    tags: ['CELULAR', 'SIGURIA', 'ASME']
  },
  {
    id: 3,
    title: 'TESTESTESTEST',
    slug: 'zgjidhjet-moderne-ndertesat-e-larta-ptest',
    excerpt: 'Zbuloni teknologjitë më të fundit që po revolucionarizojnë industrinë e ashensorëve.',
    content: `...`,
    date: '2025-10-15',
    image: 'https://imgur.com/hdsgSi7.jpg',
    category: 'MODERNIZIM, SHËRBIM & RIPARIM',
    tags: ['INSPEKTIM']
  }
  // ... more posts ...
];
