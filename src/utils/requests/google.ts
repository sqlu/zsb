import puppeteer from "puppeteer";

const googleSearchRequest = async (query: string) => {
  const browser = await puppeteer.launch({
    headless: true, // Utilise le mode headless amélioré
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();

  // Simule un vrai utilisateur
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  );

  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    {
      waitUntil: "domcontentloaded",
    }
  );

  // Attendre que les résultats s'affichent
  await page.waitForSelector("h3");

  // Extraire les résultats
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div.tF2Cxc")).map((result) => {
      const titleElement = result.querySelector("h3");
      const linkElement = result.querySelector("a");

      return {
        title: titleElement?.innerText || "No Title",
        link: linkElement?.href || "No Link",
      };
    });
  });

  await browser.close();
  return results;
};

export { googleSearchRequest };
