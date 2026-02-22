// lib/wordpress.ts
export async function getPosts() {
  const res = await fetch('https://b-aura.es/wp-json/wp/v2/posts');
  const posts = await res.json();
  return posts;
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(`https://b-aura.es/wp-json/wp/v2/posts?slug=${slug}`);
  const post = await res.json();
  return post[0];
}