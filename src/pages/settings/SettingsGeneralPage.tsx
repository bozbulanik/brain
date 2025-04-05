import { useState } from 'react'
import Select from '../../components/Select'
import Toggle from '../../components/Toggle'

const SettingsGeneralPage = () => {
  const [selectedSpellcheckerOption, setSelectedSpellcheckerOption] = useState('option0')
  const [selectedLanguageOption, setSelectedLanguageOption] = useState('option0')

  const spellcheckerOptions = [
    { value: 'option0', label: 'English (US)' },
    { value: 'option1', label: 'German' },
    { value: 'option2', label: 'French' }
  ]
  const changeSpellchecker = (loc: string) => {
    setSelectedSpellcheckerOption(loc)
  }
  const changeLanguage = (loc: string) => {
    setSelectedLanguageOption(loc)
  }
  return (
    <div className="w-full h-full px-2">
      <div className="w-full h-full flex flex-col gap-4">
        <div>
          <div className="uppercase text-text-muted font-bold text-sm">Localization</div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="flex flex-col">
                <p className="text-sm font-bold">Spell-checker Language</p>
                <p className="text-xs text-text-muted">Default: English</p>
              </div>
              <Select
                className="w-48 ml-auto"
                options={spellcheckerOptions}
                value={selectedSpellcheckerOption}
                placeholder=""
                searchable
                onChange={changeSpellchecker}
              />
            </div>
            <div className="flex items-center">
              <p className="text-sm font-bold">Application Language</p>
              <Select
                className="w-48 ml-auto"
                options={spellcheckerOptions}
                value={selectedLanguageOption}
                placeholder=""
                searchable
                onChange={changeLanguage}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="uppercase text-text-muted font-bold text-sm">Date & Time</div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-sm font-bold">Time zone</p>
              <Select
                className="w-48 ml-auto"
                options={spellcheckerOptions}
                value={selectedSpellcheckerOption}
                placeholder=""
                searchable
                onChange={changeSpellchecker}
              />
            </div>
            <div className="flex items-center">
              <p className="text-sm font-bold">Time format</p>
              <Select
                className="w-48 ml-auto"
                options={spellcheckerOptions}
                value={selectedLanguageOption}
                placeholder=""
                searchable
                onChange={changeLanguage}
              />
            </div>
            <div className="flex items-center">
              <p className="text-sm font-bold">Time convention</p>
              <Toggle
                name="hour-select"
                onText="24-hour"
                offText="12-hour"
                className="ml-auto"
                reversed
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsGeneralPage
