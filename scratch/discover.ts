async function testUrl(url: string) {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      console.log(`URL: ${url} -> Status: ${res.status}`);
      return null;
    }
    const data = await res.json();
    console.log(`URL: ${url} -> Success!`);
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    console.log(`URL: ${url} -> Failed: ${err.message}`);
  }
  return null;
}

async function discover() {
  console.log('--- Testing WordPress Users ---');
  await testUrl('https://esbpowerline.com/wp-json/wp/v2/users?per_page=3');
}

discover();
