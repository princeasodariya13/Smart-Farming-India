import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let products = await prisma.marketplaceProduct.findMany();

    if (products.length === 0) {
      const initialProducts = [
        {
          name: "John Deere 5050 D",
          seller: "AgriRent Gujarat",
          location: "Ahmedabad, Gujarat",
          rating: 4.9,
          price: 2500,
          priceUnit: "/ day",
          type: "rental",
          badge: "Rental",
          stock: "Available Now",
          category: "equipment",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBR01aXeO2ZXmEY9-jQcigiE_-Lb8xqQ05NqVTZ07p-NI-Agw6cT3y8t9NRFTMmuY2rgNMosYfkW7HRzyLMyILoAi41w4dgsB3eHNV31Z1l-OJyEAwFML-2ucsGbGiykXKai3wBsSBqsG4GLbKPKLoKt86jjhCcC5xLAB5Bq6zmSQb52h_5ueXAIqEH7NYXYCPj-_wnrjrb5os5jKGZmxbJwcSCO5W3GRJssswesa6rXv1HIos0kN8ZAtrV4zryg9cJKJs9suByWg",
          imageAlt: "John Deere tractor in Punjab field",
        },
        {
          name: "Premium Organic Fertilizer",
          seller: "Kisan Agro",
          location: "Bulk Available",
          rating: 4.7,
          price: 850,
          priceUnit: "/ 50kg bag",
          type: "buy",
          stock: "In Stock",
          category: "fertilizers",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBxDLFJNImO_gtGF90KjQSK5TgmeSqiVmcf18fBPRaM0Jy9eSU8SVK9THY6K23u5h6cjBtDatdwwTR_XCucbwngAMp91Jtk5AZaqi3qySXnOmEQRQU8KqtGuhCwjpXiR8-QjOgG_qFgwxcZ8oJZ3QpGecMv4jflMnNHCTJimSkhY6f3yNo3Rq-Mtn7arCXM3LnMhEtH9igX35s9Y8mKPFfucZ9zule5cxseB9FriEcoHqaEuab5lhEyQVZAJ3iG9syzDTKR0-k8IQ",
          imageAlt: "Bags of organic fertilizer",
        },
        {
          name: "Multi-Crop Seed Drill",
          seller: "FarmTech Rentals",
          location: "Rajkot, Gujarat",
          rating: 4.5,
          price: 1200,
          priceUnit: "/ day",
          type: "rental",
          badge: "Rental",
          stock: "5 Units Left",
          category: "equipment",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA7CMeQG3nftJ8TZctQBMVV_zBCNX4tp3yxCB-jq5xYvoSf0yB5xyRnNYq2GoERWzJUz8SOFXcQ-HCp90NsaAkaBBS6w3iuTYUCrIM9A95xXHW8FPCVpMX-kR73nZbXPEdsOcjDTSasiodHx4tEybQsf5Pl5sFqhcTg192BfVr9WJtYS7h6tCmDB762EuaKh3fcsqpc53fGvuGb23MNd9-HP1Ku1i9UmcGsBqkmX8yfAfwPFQ1opq8Li5d-7Q9tqYHdW5AhGRmMyg",
          imageAlt: "Multi-crop seed drill machine",
        },
        {
          name: "High-Yield Wheat Seeds (HD-2967)",
          seller: "Certified Seeds India",
          location: "Certified Grade A",
          rating: 4.8,
          price: 1450,
          priceUnit: "/ unit",
          type: "buy",
          stock: "10kg Packs",
          category: "seeds",
          image: "/images/wheat.png",
          imageAlt: "High-yield wheat seeds in bowl",
        },
        {
          name: "Smart Drip Controller V2",
          seller: "IrriTech Solutions",
          location: "AI-Powered",
          rating: 5.0,
          price: 12999,
          priceUnit: "",
          type: "buy",
          stock: "2 Year Warranty",
          category: "irrigation",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD3jTqqBkt6HYYe3mzgcGt98CG3C9JbVmgjTXWZlg4rq4eZ2mLfEwxJmIeJAyTwGwjeAARlRvspRv-48A7Y9oLFW0jJcRBJrqGXjpFnV0Y_U3nlAARpGRkgq3-vD_fQwfd3moBFB1RP7z-2SjmgY696MI9pOt5V2QJAHjGWNM6RVGoRp1bWiDpku9JGT9mFauNBuWLkq0kGILJimuHh2lEHUGV0FAepcn4CY5WXB2V6iFstDg2gToNxDh6HG-Nw-tduYuleYL-nxg",
          imageAlt: "Smart drip irrigation controller",
        },
        {
          name: "Combine Harvester (Pro-X)",
          seller: "HarvestPro Rentals",
          location: "Surat, Gujarat",
          rating: 4.2,
          price: 4800,
          priceUnit: "/ day",
          type: "rental",
          badge: "Rental",
          stock: "Expert Operator Included",
          category: "equipment",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD2AFu6Msorzo8Oj2XhKV6wKvfHIzXb2wZz96xrRBstb-JORtwIOvhVoVL2ZAwmexpu_PDKXHJr0Kc7E805XhgyCBD4FlUIMosVJlINS6eTcLg0xhdIeovcBW6_PBLkZuJkOwIBl0FOmVudktk192VZIOfGjoRuCzGY9SnuBQuih5YIJ4wisGEv93tVLrJsOQ0qr2oAFWlr2-DJdVinyLcVT8IwBvO_Nqs_D8TAdKjnH47Mz-Bu39iWiTcdYbhOhPh_8Yned_yijg",
          imageAlt: "Combine harvester in golden field",
        },
      ];

      for (const product of initialProducts) {
        await prisma.marketplaceProduct.create({ data: product });
      }
      products = await prisma.marketplaceProduct.findMany();
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch marketplace data' }, { status: 500 });
  }
}

import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    let userName = session?.user?.name;

    if (!userId) {
      // Fallback to first user in db if session id is not mapped properly in NextAuth
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        return NextResponse.json({ success: false, error: 'Unauthorized and no fallback user found' }, { status: 401 });
      }
      userId = fallbackUser.id;
      userName = fallbackUser.name;
    }

    const data = await request.json();
    const { name, category, type, price, priceUnit, location, image, stock } = data;

    const newProduct = await prisma.marketplaceProduct.create({
      data: {
        name,
        category: category.toLowerCase(),
        type,
        price,
        priceUnit,
        location,
        image,
        imageAlt: name,
        stock,
        // Save the actual user ID and name in the seller field with a separator so we can extract it later
        seller: `${userName || "Farmer"}||${userId}`,
        rating: 5.0,
        badge: type === "rental" ? "Rental" : null,
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
