import React, { useState } from 'react';
import { Sparkles, Zap, Hash, Copy, RefreshCw } from 'lucide-react';

export default function TikTokGenerator() {
  const [theme, setTheme] = useState('Ambition');
  const [viralType, setViralType] = useState('hook');
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const themes = ['Ambition', 'Discipline', 'Mindset', 'Succès/Argent'];
  const viralTypes = {
    hook: '🎣 Hook accrocheur',
    story: '📖 Micro-histoire',
    challenge: '🏆 Challenge viral',
    comparison: '⚖️ Avant/Après',
    quote: '💡 Citation + Contexte'
  };

  const generateContent = async () => {
    setLoading(true);
    setCopySuccess('');
    try {
      const prompt = `Tu es un expert TikTok créateur français spécialisé en contenu motivationnel pour une audience jeune et ambitieuse.

Génère UNE idée de vidéo TikTok VIRALE sur le thème: "${theme}"
Type de contenu demandé: ${viralTypes[viralType]}

INSTRUCTIONS CRITIQUES:
- Le hook (les 3 premières secondes) est ULTRA important, doit être court et percutant
- Le script doit être rapide à dire (15-30 secondes de lecture)
- Les hashtags doivent mélanger populaires (#motivationalquotes) et de niche (#ambitioustiktok)
- Adapte au jeune public français qui veut gagner de l'argent et réussir

Réponds UNIQUEMENT en JSON valide (pas de Markdown, pas d'explications):
{
  "title": "Titre accrocheur de la vidéo",
  "hook": "Les 3-5 premières secondes (15-25 mots MAX) - SUPER IMPORTANT",
  "script": "Script complet (80-120 mots, style TikTok, informal, direct)",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "callToAction": "L'appel à l'action final pour engagement",
  "duration": "15-30 secondes",
  "viralTip": "1 conseil précis pour maximiser les vues",
  "musicMood": "Style de musique (ex: trap beat, ambient, hype)"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      const cleanJson = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      setGenerated(parsed);
    } catch (error) {
      console.error('Error:', error);
      setGenerated({ error: 'Erreur de génération. Essaye à nouveau!' });
    }
    setLoading(false);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-4 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              TikTok Generator
            </h1>
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-gray-300 text-sm">✨ Génère des idées virales motivationnelles en 1 clic</p>
        </div>

        <div className="bg-gray-900 bg-opacity-70 backdrop-blur rounded-lg p-6 mb-6 border border-purple-500 border-opacity-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-100 mb-3">📌 Choisis un thème</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                      theme === t
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-100 mb-3">🎬 Style de contenu</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(viralTypes).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setViralType(key)}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all text-xs ${
                      viralType === key
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 shadow-lg text-lg"
            >
              <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '⏳ Génération...' : '🚀 GÉNÉRER UNE IDÉE'}
            </button>
          </div>
        </div>

        {generated && !generated.error && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-lg p-4 shadow-lg">
              <h2 className="text-white font-bold text-lg">{generated.title}</h2>
            </div>

            <div className="bg-red-900 bg-opacity-40 border-2 border-red-500 rounded-lg p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-300 text-xs font-bold uppercase mb-2">🔥 Hook - Premières 3 secondes (CRITIQUE!)</p>
                  <p className="text-white font-bold text-lg mb-3 bg-red-950 bg-opacity-50 p-2 rounded">{generated.hook}</p>
                  <button
                    onClick={() => copyToClipboard(generated.hook, 'hook')}
                    className={`text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 transition-all ${
                      copySuccess === 'hook' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Copy className="w-3 h-3" /> {copySuccess === 'hook' ? '✓ Copié!' : 'Copier'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 bg-opacity-70 backdrop-blur border-2 border-purple-500 border-opacity-50 rounded-lg p-4 shadow-lg">
              <p className="text-purple-300 text-xs font-bold uppercase mb-2">📝 Script complet</p>
              <p className="text-gray-100 leading-relaxed mb-3 bg-gray-800 bg-opacity-50 p-3 rounded text-sm">{generated.script}</p>
              <button
                onClick={() => copyToClipboard(generated.script, 'script')}
                className={`text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 transition-all ${
                  copySuccess === 'script' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Copy className="w-3 h-3" /> {copySuccess === 'script' ? '✓ Copié!' : 'Copier script'}
              </button>
            </div>

            <div className="bg-gray-900 bg-opacity-70 backdrop-blur border-2 border-blue-500 border-opacity-50 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-5 h-5 text-blue-400" />
                <p className="text-blue-300 text-xs font-bold uppercase">Hashtags optimisés (mélange viral + niche)</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {generated.hashtags.map((tag, i) => (
                  <span key={i} className="bg-blue-900 bg-opacity-60 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold hover:bg-opacity-80 cursor-pointer transition-all">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(generated.hashtags.join(' '), 'hashtags')}
                className={`text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 transition-all ${
                  copySuccess === 'hashtags' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Copy className="w-3 h-3" /> {copySuccess === 'hashtags' ? '✓ Copié!' : 'Copier hashtags'}
              </button>
            </div>

            <div className="bg-gray-900 bg-opacity-70 backdrop-blur border-2 border-green-500 border-opacity-50 rounded-lg p-4 shadow-lg">
              <p className="text-green-300 text-xs font-bold uppercase mb-2">💬 Call to Action</p>
              <p className="text-white font-semibold mb-3 bg-green-900 bg-opacity-30 p-2 rounded">{generated.callToAction}</p>
              <button
                onClick={() => copyToClipboard(generated.callToAction, 'cta')}
                className={`text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 transition-all ${
                  copySuccess === 'cta' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Copy className="w-3 h-3" /> {copySuccess === 'cta' ? '✓ Copié!' : 'Copier'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 bg-opacity-70 backdrop-blur border border-gray-700 rounded-lg p-4 shadow-lg">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">⏱️ Durée</p>
                <p className="text-white font-bold text-lg">{generated.duration}</p>
              </div>
              <div className="bg-gray-900 bg-opacity-70 backdrop-blur border border-gray-700 rounded-lg p-4 shadow-lg">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">🎵 Style musique</p>
                <p className="text-white font-bold text-lg">{generated.musicMood}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900 to-orange-900 bg-opacity-50 border-2 border-yellow-500 rounded-lg p-4 shadow-lg">
              <p className="text-yellow-300 text-xs font-bold uppercase mb-2">⚡ PRO TIP VIRAL</p>
              <p className="text-white font-semibold text-sm">{generated.viralTip}</p>
            </div>

            <div className="bg-cyan-900 bg-opacity-30 border-2 border-cyan-500 rounded-lg p-4">
              <p className="text-cyan-300 text-xs font-bold uppercase mb-2">📋 Prochaines étapes</p>
              <ol className="text-white text-sm space-y-1">
                <li>✅ Copie le hook et le script</li>
                <li>✅ Ouvre TikTok et crée une vidéo avec CapCut</li>
                <li>✅ Ajoute les hashtags dans la description</li>
                <li>✅ Publie et analyse les statistiques après 24h</li>
              </ol>
            </div>

            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-lg"
            >
              <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '⏳ Génération...' : '🔄 Générer une autre idée'}
            </button>
          </div>
        )}

        {!generated && !loading && (
          <div className="text-center py-12 text-gray-300">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg mb-2">Sélectionne un thème et un style,</p>
            <p className="text-lg">puis clique sur "GÉNÉRER UNE IDÉE"</p>
          </div>
        )}

        <div className="text-center mt-12 text-gray-500 text-xs">
          <p>🚀 Générateur IA TikTok | Créé avec ❤️ pour Djibril</p>
          <p className="mt-2 text-gray-600">Chaque idée est générée en temps réel par Claude</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
