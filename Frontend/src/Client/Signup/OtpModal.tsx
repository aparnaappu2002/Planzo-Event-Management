"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import "./OtpModal.css"

interface OtpModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
  onResend: () => Promise<any>
  email: string
  data?: any
  setIsOpen: (isOpen: boolean) => void
  mutation: any
  resendOtp: any
  handleError: (error: unknown) => void
  handleSuccess: () => void
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  email,
  data,
  setIsOpen,
  mutation,
  resendOtp,
  handleError,
  handleSuccess,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(120) // 2 minutes in seconds
  const [canResend, setCanResend] = useState<boolean>(false)
  const [isResending, setIsResending] = useState<boolean>(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  // Timer effect
  useEffect(() => {
    if (!isOpen) return

    let timer: NodeJS.Timeout
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setCanResend(true)
            clearInterval(timer)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isOpen, timeLeft])

  // Focus the first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOtp(Array(6).fill(""))
      setActiveInput(0)
      setTimeLeft(120)
      setCanResend(false)
    }
  }, [isOpen])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    // Only accept numbers
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    // Check if all inputs are filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      // Auto-submit when all digits are entered
      handleVerifyOtp(newOtp.join(""))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        // Move to previous input if current is empty
        if (index > 0) {
          setActiveInput(index - 1)
          inputRefs.current[index - 1]?.focus()
        }
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }

    // Handle left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }

    // Handle right arrow
    if (e.key === "ArrowRight" && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted content is numeric and has correct length
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.substring(0, 6).split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit
    })

    setOtp(newOtp)

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    setActiveInput(focusIndex)
    inputRefs.current[focusIndex]?.focus()

    // Auto-submit if all digits are filled
    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOtp(newOtp.join(""))
    }
  }

  const handleVerifyOtp = async (otpValue: string) => {
    if (isLoading) return

    setIsLoading(true)
    try {
        await mutation.mutateAsync({
            formdata: {
                email: email,
                ...data, // Your other form data
            },
            otpString: otpValue,
        })
        handleSuccess()
        onClose()
    } catch (error) {
        handleError(error)
    } finally {
        setIsLoading(false)
    }
}

  const handleResendOtp = async () => {
    if (!canResend || isResending) return

    setIsResending(true)
    try {
      await onResend()
      // Reset timer
      setTimeLeft(120)
      setCanResend(false)
      // Clear OTP fields
      setOtp(Array(6).fill(""))
      setActiveInput(0)
      inputRefs.current[0]?.focus()
    } catch (error) {
      handleError(error)
    } finally {
      setIsResending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <button className="otp-modal-close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="otp-modal-content">
          <div className="otp-modal-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>

          <h2>Verify Your Account</h2>
          <p>
            We've sent a verification code to <strong>{email}</strong>
          </p>

          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                onFocus={() => setActiveInput(index)}
                autoComplete="off"
                className={activeInput === index ? "active" : ""}
              />
            ))}
          </div>

          <div className="otp-timer">
            {timeLeft > 0 ? (
              <>
                <p>Resend code in</p>
                <span>{formatTime(timeLeft)}</span>
              </>
            ) : (
              <p>Didn't receive the code?</p>
            )}
          </div>

          <button
            className={`otp-resend-button ${canResend ? "enabled" : "disabled"}`}
            onClick={handleResendOtp}
            disabled={!canResend || isResending}
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>

          <button
            className="otp-verify-button"
            onClick={() => handleVerifyOtp(otp.join(""))}
            disabled={otp.some((digit) => digit === "") || isLoading}
          >
            {isLoading ? (
              <span className="loading-text">
                <div className="spinner"></div>
                Verifying...
              </span>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OtpModal
