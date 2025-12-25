export default function CreatePost() {
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return <div className="bg-white p-4 m-2 flex gap-4">
    <img src="https://i.pravatar.cc/150?img=1" className="rounded-full h-10" />
    <form action={handleSubmit} className="flex flex-col justify-end gap-2 w-full">
      <textarea
        rows="2"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder="Start a post"
      ></textarea>
      <div className="flex justify-end">
        <button type="submit" className="grow-0">post</button>
      </div>
    </form>
  </div>
}
