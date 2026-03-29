/** Adds the `in-view` class when the element enters the viewport (once). */
export const inview = (node: HTMLElement, options?: IntersectionObserverInit) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("in-view");
        observer.unobserve(node);
      }
    },
    { threshold: 0.15, ...options },
  );
  observer.observe(node);
  return { destroy: () => observer.disconnect() };
};
