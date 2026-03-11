export async function Submit(path: string, userId: string, password: string) {
  
  const res = await fetch(path, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, password })

  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error");
  }

  return data;
}