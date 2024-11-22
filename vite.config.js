import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv"

// https://vite.dev/config/
export default defineConfig({
  base:"/",
  plugins: [react()],
  
})
