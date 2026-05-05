import { X } from 'lucide-react'

const STICKER_GROUPS = [
  {
    label: 'Эмоции',
    items: ['😀','😂','🥹','😍','🤩','😎','🥳','😴','🤔','😮','😱','🤯','😤','😭','🥺','😇','🤗','😏','🤫','🙄'],
  },
  {
    label: 'Жесты',
    items: ['👍','👎','👏','🙌','🤝','✌️','🤞','👌','🤙','💪','🫶','🙏','☝️','👈','👉','🫵'],
  },
  {
    label: 'Предметы',
    items: ['🎉','🎊','🎓','📚','💡','🔥','⭐','💯','🏆','🎯','📝','💬','📌','⏰','🚀','❤️','💔','💤','✅','❌'],
  },
  {
    label: 'Еда',
    items: ['🍕','🍔','🌮','🍜','🍣','🍩','☕','🧋','🍺','🥂','🍎','🍌','🍓','🥑','🧁','🍦'],
  },
]

export default function StickerPicker({ onSelect, onClose }) {
  return (
    <div className="absolute bottom-full mb-2 left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-700">Стикеры</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-3 space-y-3">
        {STICKER_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-xs text-slate-400 mb-1.5">{group.label}</p>
            <div className="flex flex-wrap gap-1">
              {group.items.map((sticker) => (
                <button
                  key={sticker}
                  onClick={() => { onSelect(sticker); onClose() }}
                  className="text-2xl p-1 rounded-lg hover:bg-slate-100 transition-colors leading-none"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
