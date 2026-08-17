"use client";

import { useState } from "react";

type Product = {
  id: number;
  sku_name: string;
  brand: string;
  category: string;
  distance: number;
};

type Recommendation = {
  id: number;
  sku_name: string;
  brand: string;
  category: string;
  distance: number;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [productId, setProductId] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const searchProducts = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/semantic-search?q=${encodeURIComponent(
          query
        )}&limit=5`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setProducts(data.results);
    } catch (error) {
      console.error("Search failed:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const findRecommendations = async () => {
    if (!productId.trim()) return;
  
    setRecommendationLoading(true);
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/recommendations?product_id=${encodeURIComponent(
          productId
        )}&limit=5`
      );
  
      if (!response.ok) {
        throw new Error("Recommendation request failed");
      }
  
      const data = await response.json();
  
      setRecommendations(data.results);
    } catch (error) {
      console.error("Recommendation search failed:", error);
      setRecommendations([]);
    } finally {
      setRecommendationLoading(false);
    }
  };


  // Convert cosine distance into a simple relevance percentage.
  const getSimilarity = (distance: number) => {
    return Math.max(0, (1 - distance) * 100);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              S
            </div>

            <div>
              <h1 className="text-lg font-bold">
                Semantic Search
              </h1>

              <p className="text-xs text-slate-500">
                Intelligent product discovery
              </p>
            </div>
          </div>

          <span className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 sm:block">
            AI-powered search
          </span>

        </div>
      </header>


      {/* HERO */}
      <section className="px-6 pb-12 pt-16">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            ✦ Search by meaning, not just keywords
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find what you mean.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Describe what you are looking for in natural language and let
            semantic search find the most relevant products.
          </p>


          {/* SEARCH BAR */}
          <div className="mx-auto mt-9 flex max-w-3xl flex-col gap-3 sm:flex-row">

            <div className="flex flex-1 items-center rounded-2xl border border-slate-300 bg-white px-5 shadow-sm transition focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">

              <span className="mr-3 text-xl text-slate-400">
                ⌕
              </span>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchProducts();
                  }
                }}
                placeholder="Try “strong coffee for mornings”"
                className="w-full bg-transparent py-4 text-base outline-none placeholder:text-slate-400"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="ml-2 text-lg text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              )}

            </div>


            <button
              onClick={searchProducts}
              disabled={loading || !query.trim()}
              className="rounded-2xl bg-slate-900 px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>

          </div>


          {/* SUGGESTIONS */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">

            {[
              "strong coffee for mornings",
              "instant coffee",
              "refreshing fruit drink",
            ].map((suggestion) => (

              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
              >
                {suggestion}
              </button>

            ))}

          </div>

        </div>

      </section>

      {/* RECOMMENDATIONS */}
<section className="mx-auto max-w-6xl px-6 pb-12">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="mb-5">
      <p className="text-sm font-medium text-slate-500">
        Product recommendations
      </p>

      <h3 className="mt-1 text-2xl font-bold">
        Find similar products
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Enter a product ID to find products with similar embeddings.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">

      <input
        type="number"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="Enter product ID, e.g. 4"
        className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
      />

      <button
        onClick={findRecommendations}
        disabled={recommendationLoading || !productId.trim()}
        className="rounded-2xl bg-slate-900 px-7 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {recommendationLoading
          ? "Finding..."
          : "Find Similar"}
      </button>

    </div>

    {recommendations.length > 0 && (
      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {recommendations.map((product, index) => {

          const similarity = Math.max(
            0,
            (1 - product.distance) * 100
          );

          return (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-200 p-5 transition hover:shadow-md"
            >

              <div className="flex items-start justify-between gap-3">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                  {index + 1}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-500">
                  {product.category}
                </span>

              </div>

              <h4 className="mt-4 text-lg font-bold">
                {product.sku_name}
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                {product.brand}
              </p>

              <div className="mt-5">

                <div className="mb-2 flex justify-between text-xs">
                  <span className="uppercase tracking-wide text-slate-400">
                    Similarity
                  </span>

                  <span className="font-bold text-slate-700">
                    {similarity.toFixed(1)}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{
                      width: `${similarity}%`,
                    }}
                  />

                </div>

              </div>

            </article>
          );
        })}

      </div>
    )}

  </div>
</section>

      {/* RESULTS */}
      <section className="mx-auto max-w-6xl px-6 pb-20">

        {/* LOADING */}
        {loading && (
          <div className="py-16 text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

            <p className="text-sm text-slate-500">
              Searching the product space...
            </p>

          </div>
        )}


        {/* RESULTS FOUND */}
        {!loading && searched && products.length > 0 && (
          <>

            <div className="mb-6 flex items-end justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Search results
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Most relevant products
                </h3>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                {products.length} results
              </span>

            </div>


            {/* PRODUCT GRID */}
            <div className="grid gap-5 md:grid-cols-2">

              {products.map((product, index) => {

                const similarity = getSimilarity(product.distance);

                return (
                  <article
                    key={product.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* CARD TOP */}
                    <div className="flex items-start justify-between gap-4">

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                        {index + 1}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {product.category}
                      </span>

                    </div>


                    {/* PRODUCT NAME */}
                    <h4 className="mt-5 text-xl font-bold leading-7 text-slate-900">
                      {product.sku_name}
                    </h4>


                    {/* BRAND */}
                    <p className="mt-2 text-sm text-slate-500">
                      {product.brand}
                    </p>


                    {/* RELEVANCE */}
                    <div className="mt-6 border-t border-slate-100 pt-5">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Relevance
                        </span>

                        <span className="text-sm font-bold text-slate-700">
                          {similarity.toFixed(1)}%
                        </span>

                      </div>


                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-slate-900 transition-all"
                          style={{
                            width: `${similarity}%`,
                          }}
                        />

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          </>
        )}


        {/* NO RESULTS */}
        {!loading && searched && products.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="text-4xl">
              ⌕
            </div>

            <h3 className="mt-4 text-xl font-bold">
              No results found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try describing the product in a different way.
            </p>

          </div>

        )}

      </section>


      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-slate-400">
          Semantic Search · Next.js + React · FastAPI · PostgreSQL + pgvector
        </div>

      </footer>

    </main>
  );
}