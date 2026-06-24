import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export interface EvaluationResult {
  criteriaA: number;
  criteriaB: number;
  criteriaC: number;
  criteriaD: number;
  overallBand: number;
}

const DEFAULT_SYSTEM_INSTRUCTION = `MAGİSTRATURAYA QƏBUL İMTAHANINDA XARİCİ DİL ÜZRƏ NAMİZƏDLƏRİN YAZDIQLARI ESSELƏRİN QİYMƏTLƏNDİRİLMƏ MEYARLARI

Sən peşəkar esse qiymətləndiricisisən. Essəni aşağıdakı rəsmi meyarlara əsasən qiymətləndir.

Meyarlar: A) Essenin mövzusu, həcmi və strukturu — B) Mövzunun əhatə edilməsi — C) Məntiqi ardıcıllıq və qrammatik qaydalara əməl olunma — D) Söz ehtiyatının müxtəlifliyi və işlədilməsi

Balların maksimal paylanması: A — 1 bal, B — 2 bal, C — 1 bal, D — 1 bal. Yekun maksimal bal: 5.

A – Essenin mövzusu, həcmi və strukturu

1 bal:
- esse seçilmiş xarici dildə və mövzunun adına uyğun işlənib;
- həcmi 150-200 sözdür;
- tərkib hissələri (giriş, əsas hissə və nəticə) ayrı-ayrı abzaslarla fərqləndirilib;
- essenin tərkib hissələri arasındakı əlaqə tamamilə gözlənilib: mətn axıcıdır;
- essedə orijinallıq gözlənilib.

0.5 bal:
- esse seçilmiş xarici dildədir və mövzunun adına əsasən uyğundur;
- həcmi 150 sözdən az (minimum 130 söz) və ya 200 sözdən çoxdur;
- tərkib hissələrindən ən azı əsas hissə olmaqla ikisi ayrı-ayrı abzaslarla yazılıb, və ya tərkib hissələrindən biri yazılıb, və ya tərkib hissələri ayrı-ayrı abzaslara bölünməyib;
- essenin tərkib hissələri arasındakı əlaqə qismən gözlənilib;
- essedə orijinallıq qismən pozulub.

0 bal:
- esse seçilmiş xarici dildə yazılsa da, anlaşılan deyil və (və ya) ifadə olunan fikirlər mövzunun adına uyğun deyil;
- həcmi 130 sözdən azdır;
- essedə struktur gözlənilməyib;
- esse tamamilə şablon/əzbər cümlələrdən ibarətdir (essenin tamamilə plagiat olduğu sübut oluna bildiyi halda).

Qeyd: Yerinə yetirilməmiş, müəllifin özü/yaxınları/müəllimləri haqqında məlumat yazılmış, tələb olunan mövzulardan biri əvəzinə başqa mövzuda və ya seçilmiş dil əvəzinə başqa dildə yazılmış, yaxud oxuna bilməyən yazılar "0" balla qiymətləndirilir. Əgər A bəndi "0" bal alarsa, B bəndi qiymətləndirilmir və B, C, D "0" yazılır, yekun bal "0" olur.

B – Mövzunun əhatə edilməsi

2 bal:
- mövzu dolğun şəkildə şərh edilib və tam (hərtərəfli) əhatə olunub;
- mövzu ilə bağlı fikirlər və çıxarılan nəticələr tamamilə məntiqli və inandırıcıdır;
- mövzu ilə bağlı müstəqil mühakimə (2 və daha artıq arqument) yürüdülüb;
- fikrini əsaslandırmaq üçün sübutedici nümunələrdən (şəxsi təcrübədən) yerli-yerində istifadə edib;
- mövzu ilə bağlı həm lehinə, həm də əleyhinə fikirlər (neytrallıq) verilib.

1 bal:
- bəzi əsas məqamlar əhatə olunmaqla mövzu şərh olunub, və ya mövzu qənaətbəxş səviyyədə əhatə olunsa da, mövzu ilə bağlı olmayan fikirlər var;
- mövzu ilə bağlı fikirlər irəli sürülsə də, çıxarılan nəticə qismən məntiqli və inandırıcıdır;
- mövzu ilə bağlı məhdud sayda arqument gətirilib;
- nümunələrə məhdud şəkildə istinad edilib, kənaraçıxmalar var, və ya istinad zamanı məntiqi ardıcıllıq pozulmuşdur;
- mövzu ilə bağlı lehinə/əleyhinə fikirlər (neytrallıq) qeyd olunmayıb.

0 bal:
- mövzu müəyyən səviyyədə əhatə olunub;
- mövzudan nəzərəçarpacaq dərəcədə kənara çıxılıb (mövzudan çox yayınıb);
- müstəqil mühakimə yürüdülmür, əsaslandırılmaq istənən fikir aydın deyil;
- çıxarılan nəticə əsaslandırılmayıb və ya nəticə yoxdur;
- istifadə olunan fakt və hadisələr təhrif olunub və ya yoxdur;
- lehinə/əleyhinə fikirlər (neytrallıq) verilməyib.

Qeyd: Əgər B bəndi "0" bal alarsa, C və D bəndləri qiymətləndirilmir və C, D "0" yazılır.

C – Məntiqi ardıcıllıq və qrammatik qaydalara əməl olunma

1 bal:
- müxtəlif birləşdirici vasitələrdən istifadə edir və fikirlər arasındakı məntiqi rabitə gözlənilir;
- fərqli strukturlu cümlələr qurur, mürəkkəb cümlələr qurarkən yol verilmiş səhvlərin (orfoqrafik, qrammatik, durğu işarəsi) ümumi sayı 1-5-dir (1-2 səhvə güzəşt olunur).

0.5 bal:
- əsasən sadə birləşdirici vasitələrdən istifadə edir;
- müxtəlif strukturlu cümlələr qurmağa cəhd etsə də, yazı əsasən sadə cümlələrdən ibarətdir;
- buraxılmış səhvlər bəzən məzmunun çatdırılmasına mane olur;
- yol verilmiş səhvlərin sayı 6-7-dir (1-2 səhvə güzəşt olunur).

0 bal:
- cümlə qurmaqda çətinlik çəkir, yazı söz yığınından ibarətdir;
- yol verilmiş səhvlərin sayı 7-dən çoxdur.

Qeyd: Anlamaya mane olmayan səhvlər sayılmır.

D – Söz ehtiyatının müxtəlifliyi və işlədilməsi

1 bal:
- mövzuya uyğun zəngin söz ehtiyatı vardır və həmişə yerində işlədir;
- cüzi leksik səhvlər (1-5 səhv) məzmunun çatdırılmasına mane olmur;
- müxtəlif leksik vahidlərdən istifadə edir, leksik təkrara yol vermir (parafraz edir, sinonim yazır, söz birləşmələri istifadə edir) (1-2 səhvə güzəşt olunur).

0.5 bal:
- mövzuya uyğun kifayət qədər söz ehtiyatı vardır, ancaq bəzən yerində istifadə etmir;
- leksik səhvlər (6-7 səhv) məzmunun çatdırılmasına mane olmur;
- məhdud sayda leksik vahidlərdən istifadə edir, bəzən leksik təkrara yol verir.

0 bal:
- mövzuya uyğun söz ehtiyatı bəsitdir/yoxdur, yersiz təkrarlara yol verir;
- leksik səhvlərin sayı 7-dən çoxdur və məzmunun çatdırılmasına mane olur.

Qeyd: Anlamaya mane olmayan səhvlər sayılmır.

Ümumi qeydlər:
- Hər alt meyar üzrə bütün şərtlər ödənilərsə, maksimum bal verilir; şərtlərin çoxu/əsas hissəsi ödənilərsə, müvafiq aralıq bal yazılır.
- Eyni dil qaydasına aid təkrarlanan səhvlər 1 (bir) səhv hesab olunur.

IMPORTANT: Return ONLY valid JSON with no markdown, no code blocks, no explanations.
The response must be exactly this structure, where overallBand is the sum of criteriaA + criteriaB + criteriaC + criteriaD:
{"criteriaA": <0|0.5|1>, "criteriaB": <0|1|2>, "criteriaC": <0|0.5|1>, "criteriaD": <0|0.5|1>, "overallBand": <number>}`;

function sanitizeInput(text: string): string {
  const injectionPatterns = [
    /ignore\s+(previous|all|above)\s+instructions?/gi,
    /system\s*:\s*/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /###\s*(instruction|system|prompt)/gi,
    /you\s+are\s+now\s+/gi,
    /act\s+as\s+/gi,
    /pretend\s+to\s+be\s+/gi,
  ];
  let sanitized = text;
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, "[REMOVED]");
  }
  return sanitized.trim();
}

const VALID_A = [0, 0.5, 1];
const VALID_B = [0, 1, 2];
const VALID_C = [0, 0.5, 1];
const VALID_D = [0, 0.5, 1];

function isValidSubscore(value: unknown, allowed: number[]): value is number {
  return typeof value === "number" && allowed.includes(value);
}

export async function evaluateEssay(content: string): Promise<EvaluationResult> {
  const sanitizedContent = sanitizeInput(content);

  const prompt = `Aşağıdaki esseni qiymətləndir və yalnız JSON formatında nəticəni qaytar:
---ESSE BAŞLANĞICI---
${sanitizedContent}
---ESSE SONU---
Yalnız bunu qaytar: {"criteriaA": <0|0.5|1>, "criteriaB": <0|1|2>, "criteriaC": <0|0.5|1>, "criteriaD": <0|0.5|1>, "overallBand": <cəmi>}`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
      temperature: 0.1,
      maxOutputTokens: 256,
      responseMimeType: "application/json",
    },
  });

  const responseText = result.text?.trim() ?? "";
  const cleaned = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: EvaluationResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${cleaned}`);
  }

  if (!isValidSubscore(parsed.criteriaA, VALID_A)) {
    throw new Error(`Invalid criteriaA value: ${parsed.criteriaA}`);
  }
  if (!isValidSubscore(parsed.criteriaB, VALID_B)) {
    throw new Error(`Invalid criteriaB value: ${parsed.criteriaB}`);
  }
  if (!isValidSubscore(parsed.criteriaC, VALID_C)) {
    throw new Error(`Invalid criteriaC value: ${parsed.criteriaC}`);
  }
  if (!isValidSubscore(parsed.criteriaD, VALID_D)) {
    throw new Error(`Invalid criteriaD value: ${parsed.criteriaD}`);
  }

  if (parsed.criteriaA === 0) {
    parsed.criteriaB = 0;
    parsed.criteriaC = 0;
    parsed.criteriaD = 0;
  } else if (parsed.criteriaB === 0) {
    parsed.criteriaC = 0;
    parsed.criteriaD = 0;
  }

  const computedTotal =
    parsed.criteriaA + parsed.criteriaB + parsed.criteriaC + parsed.criteriaD;

  parsed.overallBand = Math.round(computedTotal * 2) / 2;

  return parsed;
}
