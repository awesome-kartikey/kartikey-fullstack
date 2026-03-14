interface CategoryPageProps {
  params: {
    slug: string[]; // Array of path segments
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  console.log('slug', slug);
  const breadcrumbs = slug.join('/');

  return (
    <div className="p-8">
      <h1>Category: {breadcrumbs}</h1>
      <p>Path segments: {slug.length}</p>
    </div>
  );
}