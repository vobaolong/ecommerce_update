import { useTranslation } from 'react-i18next'

const determineRank = (points) => {
  if (points < 20) return { nextRank: 'Silver', nextRankPoints: 20 }
  if (points < 100) return { nextRank: 'Gold', nextRankPoints: 100 }
  if (points < 1000) return { nextRank: 'Diamond', nextRankPoints: 1000 }
  return { nextRank: '', nextRankPoints: 1000 }
}

const ProgressBar = ({ progress }) => (
  <div
    style={{
      width: '90%',
      backgroundColor: '#e9ecef',
      height: '10px',
      borderRadius: '5px',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        width: `${progress}%`,
        height: '100%',
        backgroundColor: '#ffc107',
        transition: 'width 0.6s ease'
      }}
    />
  </div>
)

const UserRankInfo = ({ user = {}, border = true }) => {
  const { t } = useTranslation()
  const { nextRank, nextRankPoints } = determineRank(user.point || 0)
  const previousRankPoints =
    nextRankPoints === 20
      ? 0
      : nextRankPoints === 100
      ? 20
      : nextRankPoints === 1000
      ? 100
      : 1000
  const progress = nextRankPoints
    ? ((user.point - previousRankPoints) /
        (nextRankPoints - previousRankPoints)) *
      100
    : 100

  return (
    <div className='container-fluid'>
      <div
        className={`row ${border ? 'border' : ''} rounded-2 p-3`}
        style={{ backgroundColor: user.level?.color || '#gray' }}
      >
        <div className='d-flex flex-column text-white'>
          <h4 className='text-uppercase mb-0'>
            {t(user.level?.name || 'unknown')}
          </h4>
          <span>{`${user.firstName || ''} ${user.lastName || ''}`}</span>
        </div>
        <div className='rounded-2 bg-body p-3 mt-2 d-grid gap-2'>
          {user.point < 1000 && (
            <span className='text-primary'>
              {t('userRank.upgradeNextRank')}
            </span>
          )}
          <span>{t('userRank.orders')}</span>
          <span>
            <span className='text-primary'>{user.point || 0}</span>/
            {nextRankPoints}
          </span>
          <div className='d-flex align-items-center'>
            <ProgressBar progress={progress} />
            {nextRank && <div className='ms-2 text-end'>{t(nextRank)}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRankInfo
