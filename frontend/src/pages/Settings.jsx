function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-trading-text">Settings</h2>
        <p className="text-sm text-trading-textMuted mt-1">
          Configure application settings
        </p>
      </div>

      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">Supabase Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-trading-textMuted block mb-1">Supabase URL</label>
            <input
              type="text"
              defaultValue={import.meta.env.VITE_SUPABASE_URL || ''}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="https://your-project.supabase.co"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-trading-textMuted block mb-1">Supabase Anon Key</label>
            <input
              type="password"
              defaultValue={import.meta.env.VITE_SUPABASE_ANON_KEY || ''}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="your-anon-key"
              readOnly
            />
          </div>
          <div className="text-xs text-trading-textMuted">
            Configure these in your .env file or deployment environment variables.
          </div>
        </div>
      </div>

      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">Display Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-trading-text">Auto-refresh data</div>
              <div className="text-xs text-trading-textMuted">Automatically refresh market data</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-trading-text">Show charts</div>
              <div className="text-xs text-trading-textMuted">Display price charts</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">System Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-trading-textMuted">Version</span>
            <span className="text-trading-text">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-trading-textMuted">Backend</span>
            <span className="text-trading-green">Supabase</span>
          </div>
          <div className="flex justify-between">
            <span className="text-trading-textMuted">Status</span>
            <span className="text-trading-green">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
