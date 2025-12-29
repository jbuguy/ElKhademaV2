import posts from "../data/posts.json"

export const getMockPosts = async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(posts), 50);
  })
}
