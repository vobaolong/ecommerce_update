/* eslint-disable react-hooks/exhaustive-deps */

import vietnam from '../../assets/vietnam-flag-icon.svg'
import english from '../../assets/united-kingdom-flag-icon.svg'
import { locales } from '../../i18n/i18n'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const Language = ({ vertical = true }) => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  const currentLanguage = locales[i18n.language]

  return (
    <>
      {vertical ? (
        <div className='ms-2 inherit'>
          <div className='your-account'>
            <div className='d-flex align-items-center justify-content-center rounded-1 p-2 inherit lang'>
              <img
                loading='lazy'
                className='flag-icon'
                src={currentLanguage === 'English' ? english : vietnam}
                alt={`${currentLanguage} flag`}
              />
              <i className='fa-solid fa-angle-down ms-1 dropdown-icon'></i>
            </div>
            <ul className='list-group your-account-options z-10 p-2 bg-white'>
              <li
                className='list-group-item rounded-1 bg-value border-0 your-account-options-item ripple'
                onClick={() => changeLanguage('vi')}
                role='button'
                aria-label='Switch to Vietnamese'
              >
                Tiếng Việt
              </li>
              <li
                className='list-group-item rounded-1 bg-value border-0 your-account-options-item ripple mt-2'
                onClick={() => changeLanguage('en')}
                role='button'
                aria-label='Switch to English'
              >
                English
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className='d-flex align-items-center justify-content-between gap-2'>
          <button
            className={`btn rounded-1 btn-with-img ${
              i18n.language === 'en' ? 'btn-value' : 'btn-outline-value'
            }`}
            onClick={() => changeLanguage('en')}
            aria-label='Switch to English'
          >
            <img className='flag-icon me-1' src={english} alt='English flag' />
            English
          </button>
          <button
            className={`btn rounded-1 btn-with-img ${
              i18n.language === 'vi' ? 'btn-value' : 'btn-outline-value'
            }`}
            onClick={() => changeLanguage('vi')}
            aria-label='Switch to Vietnamese'
          >
            <img
              className='flag-icon me-1'
              src={vietnam}
              alt='Vietnamese flag'
            />
            Tiếng Việt
          </button>
        </div>
      )}
    </>
  )
}

export default Language
