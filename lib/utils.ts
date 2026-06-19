import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const NAMES = ['Muhammad', 'Tan', 'Ramesh', 'Ahmad', 'Lim', 'Chong', 'Fatimah', 'Siti', 'Wei', 'Kavitha']
export const BANKS = ['Maybank', 'CIMB', 'Public Bank', 'Touch n Go', 'RHB', 'Hong Leong']
export const LOCATIONS = ['Kuala Lumpur', 'Petaling Jaya', 'Penang', 'Johor Bahru', 'Shah Alam', 'Subang Jaya']
export const DEVICE_IDS = ['iPhone 13', 'Samsung S22', 'Desktop Windows', 'MacBook Pro', 'Pixel 7', 'iPad Air']

export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateRandomAccount() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

export function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}
