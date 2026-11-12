export async function GET() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return Response.json(
      { error: "NEXT_PUBLIC_API_URL is not defined. Set it before starting the web app." },
      { status: 500 },
    );
  }

  const response = await fetch(`${apiBaseUrl}/trends`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return Response.json(
      { error: `Upstream API error: ${response.status}` },
      { status: response.status },
    );
  }

  const data = await response.json();
  return Response.json(data);
}
