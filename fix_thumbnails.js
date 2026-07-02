const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix HorizThumbnail
  content = content.replace(/function HorizThumbnail.*?return \(\n\s*<div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>\n\s*<div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} \/>\n\s*<div className="absolute left-1\/2 top-\[30%\] -translate-x-1\/2 -translate-y-1\/2">\n\s*<div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac }} \/>\n\s*<\/div>\n\s*<div className="absolute bottom-6 left-0 right-0 px-3 space-y-1\.5">\n\s*<div className="h-2 rounded-full mx-auto" style={{ width: '60%', background: tx, opacity: 0\.85 }} \/>\n\s*<div className="h-1\.5 rounded-full mx-auto" style={{ width: '40%', background: ac, opacity: 0\.7 }} \/>\n\s*<\/div>\n\s*<\/div>\n\s*\)\n}/s, 
  `  if (id === 'horizontal-red-dots') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-gray-100" style={{ background: bg }}>
      <div className="absolute top-2 left-2 flex flex-wrap w-8 gap-1 opacity-20">
        {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: ac }} />)}
      </div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-4 opacity-10" style={{ borderColor: ac }} />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 relative" style={{ borderColor: ac }}>
          <div className="absolute inset-2 rounded-full opacity-10" style={{ background: ac }} />
        </div>
      </div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-1.5 w-1/3">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: ac }} />
        <div className="h-0.5 rounded-full w-full mt-3" style={{ background: ac }} />
      </div>
    </div>
  )

  if (id === 'horizontal-purple-wavy') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 left-0 bottom-0 w-1/3" style={{ background: ac, borderRadius: '0 50% 50% 0' }} />
      <div className="absolute left-6 top-1/2 -translate-x-1/2 space-y-1.5 w-1/4">
        <div className="h-2 rounded-full w-full" style={{ background: tx, opacity: 0.9 }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: bg, opacity: 0.7 }} />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 mb-2" style={{ borderColor: ac }} />
        <div className="h-1.5 rounded-full w-12" style={{ background: tx }} />
      </div>
    </div>
  )

  if (id === 'horizontal-brown-triangles') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 left-0 border-l-[40px] border-b-[40px] border-transparent" style={{ borderLeftColor: ac }} />
      <div className="absolute bottom-0 left-0 border-l-[60px] border-t-[60px] border-transparent" style={{ borderLeftColor: tx }} />
      <div className="absolute bottom-2 left-2 flex gap-1">
        <div className="w-0 h-0 border-l-[5px] border-b-[5px] border-r-[5px] border-transparent" style={{ borderBottomColor: ac }} />
        <div className="w-0 h-0 border-l-[5px] border-b-[5px] border-r-[5px] border-transparent" style={{ borderBottomColor: tx }} />
      </div>
      <div className="absolute left-16 top-1/2 -translate-y-1/2 space-y-1.5 w-1/4">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: ac }} />
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 mb-2" style={{ borderColor: ac }} />
        <div className="h-1.5 rounded-full w-12" style={{ background: tx }} />
      </div>
    </div>
  )

  if (id === 'horizontal-luxury-gold') return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute inset-1 border" style={{ borderColor: ac, opacity: 0.3 }} />
      <div className="absolute inset-2 border" style={{ borderColor: ac, opacity: 0.1 }} />
      <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-1.5 w-1/3">
        <div className="h-2 rounded-full w-full" style={{ background: tx }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: ac }} />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-12 h-12 rounded-sm border mb-2 flex items-center justify-center rotate-45" style={{ borderColor: ac }}>
          <div className="w-8 h-8 border opacity-50" style={{ borderColor: ac }} />
        </div>
        <div className="h-1.5 rounded-full w-12 mt-2" style={{ background: ac }} />
      </div>
    </div>
  )

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: bg }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ac }} />
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: ac }} />
      </div>
      <div className="absolute bottom-6 left-0 right-0 px-3 space-y-1.5">
        <div className="h-2 rounded-full mx-auto" style={{ width: '60%', background: tx, opacity: 0.85 }} />
        <div className="h-1.5 rounded-full mx-auto" style={{ width: '40%', background: ac, opacity: 0.7 }} />
      </div>
    </div>
  )
}`);

  fs.writeFileSync(filePath, content);
}

processFile('/Users/nawinkumar/Desktop/Nawin/Mathiverse/biz-card-ui/src/pages/LandingPage.jsx');
processFile('/Users/nawinkumar/Desktop/Nawin/Mathiverse/biz-card-ui/src/components/TemplatePanel/TemplatePanel.jsx');
