"use client"

import React, { useState, useEffect } from "react"
import { Clock, AlertCircle, X, Loader2 } from "lucide-react"
import { useTokenExpiration } from "@/hooks/useTokenExpiration"
import { refreshToken } from "@/lib/api-auth"

interface TokenExpirationAlertProps {
  /**
   * Nombre de minutes avant expiration pour afficher l'alerte
   * @default 5
   */
  thresholdMinutes?: number
  /**
   * Callback quand l'utilisateur clique sur "Renouveler"
   */
  onRefresh?: () => void
  /**
   * Position de l'alerte
   */
  position?: "top" | "bottom"
}

/**
 * Composant d'alerte pour l'expiration du token
 * À inclure dans le layout principal (ex: app/layout.tsx)
 */
export default function TokenExpirationAlert({
  thresholdMinutes = 5,
  onRefresh,
  position = "top",
}: TokenExpirationAlertProps) {
  const { isExpiringSoon, minutesLeft, isRefreshing } = useTokenExpiration(thresholdMinutes)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (isExpiringSoon && minutesLeft !== null && minutesLeft > 0) {
      setIsVisible(true)
      setIsAnimatingOut(false)
    }
  }, [isExpiringSoon, minutesLeft])

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      const result = await refreshToken()
      
      if (result) {
        console.log("[TokenExpiration] Token refreshed successfully")
        handleClose()
        window.dispatchEvent(new CustomEvent("auth:token-refreshed"))
        onRefresh?.()
      } else {
        throw new Error("Refresh returned null")
      }
    } catch (err) {
      console.error("[TokenExpiration] Manual refresh failed:", err)
      setHasError(true)
      // L'erreur est gérée, mais afficher le message d'erreur
      setTimeout(() => setHasError(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) {
    return null
  }

  const positionClasses = position === "top" ? "top-0" : "bottom-0"
  const animationClass = isAnimatingOut ? "animate-slide-out" : "animate-slide-in"

  return (
    <div
      className={`fixed ${positionClasses} left-0 right-0 z-50 ${animationClass}`}
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto max-w-2xl">
        {hasError ? (
          <div className="m-4 flex items-center gap-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Erreur de renouvellement</h3>
              <p className="mt-1 text-sm text-red-800">
                Impossible de renouveler votre session. Vous serez redirigé vers la connexion.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-md bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="m-4 flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-lg">
            {/* Icône */}
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
            </div>

            {/* Contenu */}
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">
                ⏰ Votre session expire bientôt
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Votre session expire dans{" "}
                <span className="font-bold text-amber-900">{minutesLeft} minute(s)</span>
                . Cliquez sur "Renouveler" pour rester connecté.
                {isRefreshing && <span className="ml-2 text-amber-700">(Renouvellement automatique...)</span>}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-shrink-0 gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Renouveler la session"
              >
                {isLoading || isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                {isLoading || isRefreshing ? "Renouvellement..." : "Renouveler"}
              </button>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md bg-amber-100 p-2 text-amber-600 transition-colors hover:bg-amber-200 active:bg-amber-300 disabled:opacity-50"
                aria-label="Fermer l'alerte"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(${position === "top" ? "-" : ""}100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-out {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(${position === "top" ? "-" : ""}100%);
            opacity: 0;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .animate-slide-out {
          animation: slide-out 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  )
}
