import Header from "./header";

function Layout(props) {
  return (
    <div className="antialiased overflow-x-hidden flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-6xl p-4 mx-auto md:px-2 md:py-12">{props.children}</main>
    </div>
  );
}

export default Layout;
