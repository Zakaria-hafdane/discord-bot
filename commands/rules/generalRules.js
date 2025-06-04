// Replace with actual channel IDs from your Discord server
const channels = {
  rpRules: '1374864319296049172',
  lspdRules: '1374864965571317870',
  banRules: '1375463367480967359',
  gangRules: '1374864783660285973'
};

// Rule messages mapped by channel
const rulesMessages = {
  rpRules: `🔹 NO FEAR
يجب على اللاعب أن يشعر بالخوف كما في الحياة الواقعية عندما تكون حياته في خطر، عند مخالفة القوانين، أو مطاردته من طرف الشرطة.

🔹 CAR KILL
دهس مواطن بالسيارة سواء بسبب أو بدون سبب يُعتبر ممنوعاً تماماً.

🔹 POWER GAMING
القيام بأفعال غير واقعية مثل القفز من فوق الجسر والاستمرار وكأن شيئاً لم يكن...

🔹 FREE KILL
القتل العشوائي دون سبب أو سابق إنذار...

🔹 MASS RP
يجب افتراض وجود سكان، كاميرات مراقبة، وحياة نشيطة...

🔹 META GAMING
ممنوع استخدام معلومات من خارج اللعبة...

🔹 REVENGE KILL
الانتقام من شخص قتلك سابقاً ممنوع...

🔹 FORCE RP
ممنوع فرض سيناريوهات صعبة على لاعبين آخرين...

🔹 PAIN RP
يجب إظهار الألم في المواقف التي تستدعي ذلك...

🔹 MIX RP
ممنوع خلط شخصية اللاعب الواقعية مع شخصيته داخل اللعبة...

🔹 COHERENCE RP
يجب احترام منطق شخصيتك...

🔹 MIX SCENE
ممنوع التدخل في سيناريو لم ينتهِ بعد...

🔹 FAIR RP
كن منصفاً وتجنب التركيز على الفوز فقط...

🔹 WIN RP
ممنوع محاولة الفوز دائماً...

🔹 RACCOURCI RP
لا تستخدم المظهر الخارجي للتعرف على شخص...

🔹 FUIR RP
ممنوع الخروج من السيرفر عمداً...

🔹 COP BAIT
ممنوع استفزاز الشرطة عمداً...

🔹 US GLITCH
استغلال الثغرات أو الأخطاء البرمجية ممنوع...

✅ الاحترام واجب، والقوانين واضحة. خرق أي بند يؤدي إلى إنذار أو حظر...
🎯 الهدف ديالنا: متعة، واقعية، وعدالة داخل السيرفر!`,

  lspdRules: `🔹 Rank & Equipment | الرتب والمعدات
يجب الالتزام بالزي الرسمي والمركبات الخاصة برتبتك فقط...

🔹 No Equipment Leaks | منع تسريب العتاد
يمنع منعاً باتاً بيع أو إعطاء معدات الشرطة...

🔹 Weapon Confiscation | مصادرة الأسلحة
لا يجوز مصادرة سلاح المشتبه به إلا إذا...

🔹 Use of Force | إطلاق النار
لا يُسمح لك بإطلاق النار إلا إذا تأكدت...

🔹 Lethal Force Rules | القتل تحت الواجب
لا يحق لك قتل المجرم إلا إذا بدأ بإطلاق النار...

🔹 ID & Serial Number | الرقم التسلسلي
يحق لأي مواطن طلب رقمك التسلسلي...

🔹 Official Vehicles Only | المركبات الرسمية فقط
بصفتك شرطيًا أثناء الخدمة، لا يُسمح لك...

🔹 Reasonable Suspicion | سبب واضح للتحقيق
يجب أن يكون هناك سبب واضح...

🔹 Right to Attorney | حق المحامي
يحق للمتهم طلب وجود محامٍ أثناء الاستجواب...

🛑 Breaking these rules may lead to demotion or ban...
🎯 Respect the badge, serve the people.`,

  banRules: `🔻 ⛔ Free Kill (القتل العشوائي)
🔸 العقوبة: Ban لمدة 24 ساعة

🔻 ⛔ Troll (اللعب غير الجاد)
🔸 العقوبة: Ban لمدة 48 ساعة

🔻 ⛔ Revenge Kill
🔸 العقوبة: Ban لمدة 24 ساعة

🔻 ⛔ Meta Gaming
🔸 العقوبة: Ban لمدة 24 ساعة

🔻 ⛔ HRP
🔸 العقوبة: Ban لمدة 48 ساعة

🔻 ⛔ Power Gaming
🔸 العقوبة: Ban لمدة 24 ساعة

🔻 ⛔ Alt + F4
🔸 العقوبة: Ban لمدة 24 ساعة

🔻 ⛔ No Fear
🔸 العقوبة: Ban لمدة 24 ساعة

🔻 ⛔ Mass RP
🔸 العقوبة: Ban لمدة 24 ساعة

⚠️ التكرار = Ban دائم.
📩 للاستفسار: افتح تذكرة Ticket.`,

  gangRules: `🔹 Store Robbery | سرقة المحلات
• 👥 Max: 2 أشخاص
• 🚗 1 سيارة فقط
• 🕒 خاصك تسنى البوليس 5 دقائق على الأقل

🔹 House Robbery
• 👥 Max: 2 أشخاص
• 🚗 1 سيارة فقط
• ⏱️ خاص العملية تكون سريعة

🔹 Fleeca Bank Robbery
• 👥 Min: 3 / Max: 5
• 🚗 Max: 2 سيارات
• 🕒 انتظر البوليس 15 دقيقة على الأقل

🔹 Jewelry Robbery
• 👥 Min: 4 / Max: 6
• 🚗 Max: 3 سيارات
• 🕒 انتظر البوليس 20 دقيقة على الأقل

🔹 Paleto Bank Robbery
• 👥 Min: 5 / Max: 6
• 🚗 Max: 4 سيارات
• 🕒 انتظر البوليس 25 دقيقة

🔹 Pacific Bank Robbery
• 👥 Min: 6 / Max: 10
• 🚗 Max: 5 سيارات
• 🔫 استعمال SMG إجباري
• 🕒 انتظر البوليس 30 دقيقة

🔹 Train Robbery
• 👥 Min: 3 / Max: 5
• 🚗 Max: 2 سيارات
• 🕒 انتظر البوليس 15 دقيقة

⚠️ أي سرقة خارج القواعد = خرق RP
🎯 الاحترام والتنظيم = تجربة RP واقعية`
};

async function sendRulesToChannels(client) {
  for (const [key, channelId] of Object.entries(channels)) {
    const channel = await client.channels.fetch(channelId);
    if (channel?.isTextBased()) {
      await channel.send(rulesMessages[key]);
    }
  }
}

// Call sendRulesToChannels(client) after whitelist is complete
