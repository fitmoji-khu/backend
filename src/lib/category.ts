export function upperCategory(lowerCategory: string): "상의" | "하의" | "아우터" | "unknown" {
    const mapping: Record<string, string[]> = {
        상의: [
            "long_sleeve_dress", "long_sleeve_top",
            "short_sleeve_dress", "short_sleeve_top",
            "skirt", "sling", "sling_dress", "vest_dress"
        ],
        하의: ["shorts", "trousers"],
        아우터: ["long_sleeve_outwear", "short_sleeve_outwear", "vest"],
    };

    for (const [upper, lower] of Object.entries(mapping)) {
        if (lower.includes(lowerCategory)) {
            return upper as "상의" | "하의" | "아우터";
        }
    }
    return "unknown";
}

export function lowerCategory(lowerCategory: string): string {
    const mapping: Record<string, string> = {
        long_sleeve_dress: "긴팔 원피스",
        long_sleeve_outwear: "긴팔 아우터",
        long_sleeve_top: "긴팔 상의",
        short_sleeve_dress: "반팔 원피스",
        short_sleeve_outwear: "반팔 아우터",
        short_sleeve_top: "반팔 상의",
        shorts: "반바지",
        skirt: "치마",
        sling: "민소매",
        sling_dress: "민소매 원피스",
        trousers: "바지",
        vest: "조끼",
        vest_dress: "조끼 원피스"
    };

    return mapping[lowerCategory] || lowerCategory;
}