import { query } from "./db.mjs";

export async function validateWithComps(city, sqft, listPrice) {
  const sql = `
    SELECT
      AVG(ClosePrice / NULLIF(LivingArea, 0)) AS avg_ppsf,
      COUNT(*) AS comp_count
    FROM california_sold
    WHERE City = ?
      AND PropertyType = 'Residential'
      AND LivingArea BETWEEN ? AND ?
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      AND ClosePrice > 0
      AND LivingArea > 0
  `;

  const results = await query(sql, [city, sqft * 0.8, sqft * 1.2]);

  const averagePpsf = Number(results[0].avg_ppsf || 0);
  const compCount = Number(results[0].comp_count || 0);

  if (averagePpsf === 0) {
    return {
      compPrice: 0,
      listPrice,
      compCount,
      differencePercent: 0,
    };
  }

  const compPrice = averagePpsf * sqft;

  const differencePercent = ((listPrice - compPrice) / compPrice) * 100;

  return {
    compPrice: Math.round(compPrice),
    listPrice,
    compCount,
    differencePercent: Number(differencePercent.toFixed(1)),
  };
}
