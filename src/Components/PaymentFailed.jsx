import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function PaymentError() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d8cbc4] to-[#f0e6e0] flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3d251e] mb-12" style={{animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'}}>
          Payment error
        </h1>
        
        <div className="relative w-full max-w-2xl mx-auto">
          {/* Background Blob */}
          <div className="absolute inset-0 bg-[#a08679]/50 rounded-full blur-3xl transform -translate-y-1/4" style={{animation: 'pulse 2s infinite'}} />
          
          {/* Main Content */}
          <div className="relative">
            {/* Laptop Illustration */}
            <div className="relative mx-auto w-full max-w-lg aspect-[4/3] bg-[#4c3228] rounded-lg shadow-xl p-4" style={{animation: 'fadeIn 0.5s ease-out'}}>
              <div className="h-full bg-[#5b3e31] rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-[#765341] h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{animation: 'bounce 1s infinite'}}>
                    <X className="h-8 w-8 text-[#d8cbc4]" />
                  </div>
                </div>
              </div>
            </div>

            {/* People Illustrations */}
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-17%20at%2012.28.32%E2%80%AFPM-wYk2DLxdYjcT6AAU0COJMYoQE8LQ5N.png"
              alt="Frustrated users"
              className="absolute -left-4 bottom-0 w-24 h-32 object-cover opacity-90"
              style={{animation: 'float 3s ease-in-out infinite'}}
            />
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-17%20at%2012.28.32%E2%80%AFPM-wYk2DLxdYjcT6AAU0COJMYoQE8LQ5N.png"
              alt="Frustrated users"
              className="absolute -right-4 bottom-0 w-24 h-32 object-cover opacity-90"
              style={{animation: 'float 3s ease-in-out infinite 1.5s'}}
            />
          </div>
        </div>


        <p className="mt-8 text-[#4c3228] max-w-md mx-auto" style={{animation: 'fadeIn 0.5s ease-out 0.3s both'}}>
        Your order has been placed successfully, but the payment could not be processed. 
        Please try completing the payment again or contact our support team for assistance      
        </p>
        

        <div className="mt-8 flex gap-4 justify-center" style={{animation: 'fadeIn 0.5s ease-out 0.6s both'}}>
          <button
          onClick={()=>navigate('/user/cakes')}
           className="bg-[#f0e6e0] text-[#3d251e] px-6 py-2 rounded-lg border border-[#3d251e] hover:bg-[#d8cbc4] transition-colors">
            Continue to shopping
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

export default PaymentError

