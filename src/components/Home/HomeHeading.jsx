function HomeHeading({ title, desc }) {
  return (
    <header className="text-center py-5 px-3 space-y-4 max-w-2xl">
      <h5 className="text-2xl md:text-4xl font-bold">{title}</h5>
      <p className="text-sm md:text-lg text-foreground/80">{desc}</p>
    </header>
  );
}
export default HomeHeading;
