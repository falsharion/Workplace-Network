
export function AboutUsIntro() {
  return (
    <div>
      <h2 className="text-2xl sm:text-xl font-bold mb-4" style={{ color: '#0B0E14' }}>
        About Us
      </h2>
      <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed">
     Workplace Network is a faith-based mentoring and networking platform focused on career excellence and future readiness for professionals and entrepreneurs in the marketplace.
      </p>
    </div>
  )
}

export function AboutUsBody() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        <span className="font-semibold text-gray-800">The purpose</span> of the platform is to develop capabilities and mindset for talent
        across different job families (discipline) that will drive productivity and
        improve quality of life.
      </p>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        To achieve this objective, the platform will engage and explore multiple channels
        such as mentoring events, thought leadership programmes, master classes,
        storytelling, career series and campaigns.
      </p>
    </div>
  )
}

// Keep the original export so nothing else breaks
export function AboutUs() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
      <AboutUsIntro />
      <AboutUsBody />
    </div>
  )
}