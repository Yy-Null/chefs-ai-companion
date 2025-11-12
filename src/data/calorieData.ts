// src/data/calorieData.ts

// 中文备注：我们使用Map数据结构，因为它在查找键时性能很好。
// 键 (key): 食材的日文名
// 值 (value): 一个包含卡路里和单位的对象
export const calorieData = new Map<string, { calories: number, unit: string }>([
    // 主食類 (単位: グラム)
    ['小麦粉', { calories: 3.64, unit: 'g' }],
    ['米', { calories: 3.46, unit: 'g' }],
    ['パン', { calories: 2.65, unit: 'g' }],

    // 野菜類 (単位: グラム)
    ['トマト', { calories: 0.20, unit: 'g' }], // 1個(約150g)で約30kcal
    ['ブロッコリー', { calories: 0.34, unit: 'g' }],
    ['じゃがいも', { calories: 0.77, unit: 'g' }],
    ['玉ねぎ', { calories: 0.39, unit: 'g' }],
    ['卵', { calories: 150, unit: '個' }], // 1個(約50g)で約75kcalだが、ここでは中サイズを想定

    // タンパク質類 (単位: 個 または グラム)
    ['鶏胸肉', { calories: 1.08, unit: 'g' }],
    ['牛肉', { calories: 2.50, unit: 'g' }],
    ['豚肉', { calories: 3.86, unit: 'g' }],
    ['豆腐', { calories: 0.57, unit: 'g' }],

    // 調味料・その他 (単位: グラム または ミリリットル)
    ['砂糖', { calories: 3.84, unit: 'g' }],
    ['サラダ油', { calories: 9.21, unit: 'g' }],
    ['牛乳', { calories: 0.67, unit: 'ml' }],
]);

// 注意：ユーザーが入力する単位と、ここの単位が一致する必要があります。
// 「塩」や「醤油」などの低カロリー調味料は、計算を簡略化するため一旦無視しています。