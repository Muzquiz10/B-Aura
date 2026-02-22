export async function getAllPosts() {
  const res = await fetch('https://b-aura.es/wp-json/wp/v2/posts?per_page=100')
  const posts = await res.json()

  return posts.map((p) => ({
    slug: p.slug,
  }))
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(`https://b-aura.es/wp-json/wp/v2/posts?slug=${slug}`, {
    cache: 'force-cache'
  })

  const posts = await res.json()
  return posts[0]
}

