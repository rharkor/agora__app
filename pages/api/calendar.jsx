export default async function handler(req, res) {
  const url = `https://apps.univ-lr.fr/cgi-bin/WebObjects/ServeurPlanning.woa/wa/ics?login=${req.body.username}`;
  const data = await fetch(url);
  const blob = await data.blob();
  const text = await blob.text();
  return res.send(text);
}
