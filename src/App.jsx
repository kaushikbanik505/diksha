import { AnimatePresence, motion as Motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { sendNumberEmail } from './lib/email'

const COUNTRY_CODES = ['+91', '+1', '+44', '+61', '+971', '+65']

const hearts = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 17) % 100}%`,
  size: 12 + (index % 5) * 7,
  duration: 7 + (index % 6),
  delay: (index % 7) * 0.9,
  opacity: 0.2 + (index % 4) * 0.18,
}))

function App() {
  const [screen, setScreen] = useState('welcome')
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNoActive, setIsNoActive] = useState(false)
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (screen !== 'question') return

    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return

    const maxX = Math.max(8, rect.width - 180)
    const maxY = Math.max(10, rect.height - 72)

    setNoButtonPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    })
  }, [screen, isNoActive])

  const handleQuestionHover = () => {
    if (screen !== 'question') return
    setIsNoActive(true)

    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return

    const maxX = Math.max(8, rect.width - 180)
    const maxY = Math.max(10, rect.height - 72)

    setNoButtonPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    })
  }

  const handleNoTap = () => {
    if (screen !== 'question') return
    setIsNoActive(true)

    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return

    const maxX = Math.max(8, rect.width - 180)
    const maxY = Math.max(10, rect.height - 72)

    setNoButtonPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    })
  }

  const validatePhone = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const valid = cleaned.length >= 10 && cleaned.length <= 15
    return { cleaned, valid }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { cleaned, valid } = validatePhone(phoneNumber)

    if (!cleaned || !valid) {
      setError('Please enter a valid phone number before sending.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await sendNumberEmail({
        country_code: countryCode,
        phone_number: cleaned,
      })
      setScreen('submitted')
    } catch (submitError) {
      setError(
        'The message could not be sent right now. Please check your EmailJS configuration or try again later.',
      )
      console.error(submitError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderWelcome = () => (
    <Motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-10"
    >
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-r from-pink-200/70 via-white/40 to-purple-200/70 blur-3xl" />
        {hearts.map((heart) => (
          <Motion.span
            key={heart.id}
            className="pointer-events-none absolute text-pink-300/80"
            style={{
              left: heart.left,
              top: '24%',
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
            animate={{ y: [0, -20, 0], x: [0, 8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: heart.duration, repeat: Infinity, ease: 'easeInOut', delay: heart.delay }}
          >
            ❤
          </Motion.span>
        ))}

        <Motion.div
          initial={{ scale: 0.96, rotate: -2 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 14 }}
          className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 p-3 shadow-[0_20px_60px_rgba(196,146,171,0.22)] backdrop-blur-xl"
        >
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#f4d3df] bg-gradient-to-br from-[#fff7fb] via-[#fff4f5] to-[#f5ecff] p-2">
            <img
              src="/diksha-placeholder.jpg"
              alt="Diksha placeholder"
              className="h-[480px] w-full rounded-[1.2rem] object-cover shadow-[0_18px_40px_rgba(195,130,160,0.2)]"
            />
          </div>
        </Motion.div>
      </div>

      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35rem] text-pink-500/80">A little surprise</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#41182e] sm:text-5xl">
          Hey, Diksha! <span className="text-pink-500">❤️</span>
        </h1>
        <p className="mt-4 text-lg text-[#63374a] sm:text-xl">How is your day going?</p>
        <p className="mt-4 text-base font-medium text-[#7d425d] sm:text-lg">
          I hope you're having a beautiful day! <span className="text-pink-500">✨</span>
        </p>
      </div>

      <Motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setScreen('question')}
        className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ff8ab7] via-[#d896ff] to-[#f6c179] px-7 py-4 text-base font-semibold text-white shadow-[0_20px_40px_rgba(236,133,172,0.38)]"
      >
        There's something I want to ask you <Mail className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Motion.button>
    </Motion.section>
  )

  const renderQuestion = () => (
    <Motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-10"
      ref={wrapperRef}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,179,203,0.24),_transparent_50%)]" />
      <Motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl rounded-[2rem] border border-white/60 bg-white/55 p-6 shadow-[0_20px_60px_rgba(196,146,171,0.15)] backdrop-blur-xl sm:p-8"
      >
        <p className="text-center text-sm uppercase tracking-[0.35rem] text-pink-500/80">A tiny question</p>
        <h2 className="mt-5 text-center text-2xl font-semibold text-[#41182e] sm:text-4xl">
          Okay Diksha, I have a little question for you...
        </h2>

        <div className="mt-8 rounded-[1.5rem] border border-[#f2d2df] bg-gradient-to-br from-[#fffafb] to-[#fff3f7] p-5 text-center shadow-inner sm:p-8">
          <p className="text-xl font-bold leading-relaxed text-[#4d1d30] sm:text-3xl">
            Would you like to share your phone number with me? <span className="text-pink-500">🥹❤️</span>
          </p>
        </div>

        <div className="relative mt-10 flex min-h-[140px] items-center justify-center gap-5 sm:gap-8">
          <Motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setScreen('phone')}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff7da9] to-[#d190ff] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(233,129,170,0.45)] sm:text-lg"
          >
            YES! <Heart className="ml-2 h-5 w-5 fill-white" />
          </Motion.button>

          <Motion.button
            type="button"
            onMouseEnter={handleQuestionHover}
            onClick={handleNoTap}
            onTouchStart={handleNoTap}
            animate={{ x: noButtonPos.x, y: noButtonPos.y }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="absolute inline-flex items-center justify-center rounded-full border border-pink-200 bg-white/90 px-6 py-3 text-base font-semibold text-[#5d2a40] shadow-[0_15px_30px_rgba(177,130,153,0.2)] sm:text-lg"
            style={{ left: 0, top: 0 }}
          >
            NO <span className="ml-2">🙈</span>
          </Motion.button>
        </div>
      </Motion.div>
    </Motion.section>
  )

  const renderPhone = () => (
    <Motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto flex w-full max-w-lg flex-col items-center justify-center px-4 py-10"
    >
      <Motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        className="w-full rounded-[2rem] border border-white/60 bg-white/60 p-5 shadow-[0_22px_60px_rgba(196,146,171,0.18)] backdrop-blur-xl sm:p-7"
      >
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.35rem] text-pink-500/85">Yayyy! 💖</p>
          <h3 className="mt-4 text-3xl font-bold text-[#3f1a2e] sm:text-4xl">Yayyy! You just made my day! ❤️</h3>
          <p className="mt-4 text-base text-[#5c384b] sm:text-lg">Okay, can I have your WhatsApp number?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-[1.25rem] border border-[#f3d5e1] bg-[#fffafc] p-3 shadow-inner">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22rem] text-[#7b4b5b]">
              <Phone className="h-4 w-4" /> Country code
            </label>
            <select
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#f0d2dc] bg-white px-3 py-3 text-base text-[#4f1d2d] outline-none ring-0 transition focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,0.12)]"
            >
              {COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-[1.25rem] border border-[#f3d5e1] bg-[#fffafc] p-3 shadow-inner">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22rem] text-[#7b4b5b]">
              <MessageCircle className="h-4 w-4" /> Phone number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              onChange={(event) => {
                const digitsOnly = event.target.value.replace(/\D/g, '')
                setPhoneNumber(digitsOnly)
                if (error) setError('')
              }}
              placeholder="9876543210"
              className="mt-2 w-full rounded-xl border border-[#f0d2dc] bg-white px-3 py-3 text-base text-[#4f1d2d] outline-none transition focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,0.12)]"
            />
          </div>

          <div className="rounded-2xl border border-[#f7d9e8] bg-gradient-to-r from-[#fff4f9] to-[#f8f4ff] p-3 text-sm text-[#714961]">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-pink-500" />
              <p>
                Your number will be shared with Kaushik through email when you submit it. <span className="font-semibold text-pink-600">❤️</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
          )}

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8ab7] via-[#c98cff] to-[#f2b997] px-6 py-4 text-base font-semibold text-white shadow-[0_20px_45px_rgba(214,145,205,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Sending...' : 'Send it to me'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </Motion.button>
        </form>
      </Motion.div>
    </Motion.section>
  )

  const renderSubmitted = () => (
    <Motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto flex w-full max-w-xl flex-col items-center justify-center px-4 py-14 text-center"
    >
      <Motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-[2rem] border border-white/60 bg-white/60 p-8 shadow-[0_22px_60px_rgba(196,146,171,0.18)] backdrop-blur-xl"
      >
        <Motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: [0.8, 1.2, 1] }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-violet-200 text-pink-600"
        >
          <Check className="h-10 w-10" />
        </Motion.div>

        <p className="text-sm uppercase tracking-[0.35rem] text-pink-500/80">Thank you</p>
        <h3 className="mt-4 text-3xl font-bold text-[#3e1a2d]">You made my day! <span className="text-pink-500">❤️</span></h3>
        <p className="mt-4 text-base text-[#684455] sm:text-lg">
          I&apos;ll be waiting for your message on WhatsApp soon. <Sparkles className="mb-1 inline h-4 w-4 text-yellow-500" />
        </p>
      </Motion.div>
    </Motion.section>
  )

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#fffafc] via-[#fff5f9] to-[#fff7f2] text-[#472334]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-2 sm:p-4">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && renderWelcome()}
          {screen === 'question' && renderQuestion()}
          {screen === 'phone' && renderPhone()}
          {screen === 'submitted' && renderSubmitted()}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
