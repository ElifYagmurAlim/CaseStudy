export const metadata = {
  title: "Elif'in Mağazası | E-Ticaretin Yeni Adresi",
  description: "Elektronikten giyime, ev dekorasyonundan kitaplara kadar binlerce ürünü keşfedin. Hızlı teslimat ve güvenli ödeme imkanıyla şimdi alışverişe başlayın.",
  keywords: ["e-ticaret", "alışveriş", "online mağaza", "giyim", "elektronik", "kitap", "oyuncak", "indirim", "ucuz ürünler"],
  openGraph: {
    title: "Elif'in Mağazası | E-Ticaretin Yeni Adresi",
    description: "Kategorilere göz atın, fırsatları kaçırmayın. Elif'in Mağazası ile güvenli ve kolay alışverişin tadını çıkarın.",
    url: "https://www.efikstore.com",
    siteName: "Elif'in Mağazası",
    images: [
      {
        url: "https://www.efikstore.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elif'in Mağazası",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elif'in Mağazası",
    description: "Binlerce ürün. Güvenli alışveriş. Hemen keşfet.",
    images: ["https://www.efikstore.com/og-image.jpg"],
  },
  metadataBase: new URL("https://www.efikstore.com"),
};

import { redirect } from 'next/navigation';

export default function HomeRootPage() {
  redirect('/home');
}