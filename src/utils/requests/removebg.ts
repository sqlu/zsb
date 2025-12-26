const removeBgRequest = async (imageURL: string) => {
  const response = await fetch("https://api.segmind.com/v1/bg-removal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.REMOVEBG_API_KEY!,
    },
    body: JSON.stringify({ image_url: imageURL }),
  });

  console.log(response);

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return null;
  } else {
    console.error(response.statusText);
    return null;
  }
};

export { removeBgRequest };
