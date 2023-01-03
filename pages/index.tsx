import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { UseUser } from 'hooks/useUser'
import { CarOfferRes, DefaultService } from '@openapi'
import ListItem from '@components/home/list-item/ListItem'
import Map from '@components/home/map/Map'
import Input from '@components/shared-components/input/Input'
import Button from '@components/shared-components/button/Button'

const Home = ({
  carOffers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { logout, user } = UseUser()

  const handleLogout = () => {
    logout?.()
  }

  return (
    <div className="w-screen h-screen p-8 bg-brand-gray-400">
      <Head>
        <title>Car-Go</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="flex items-center justify-between mb-8">
          <p className="text-3xl font-semibold cursor-default text-brand-gray-100">
            cargo.<span className="text-brand-red">co</span>
          </p>
          {user ? (
            <div className="flex flex-col items-end">
              <p className="hidden text-xs sm:block text-brand-gray-200">
                {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="text-brand-red hover:underline"
              >
                Wyloguj
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-brand-red hover:underline">
              Zaloguj
            </Link>
          )}
        </div>
        <div className="flex gap-8 h-[90%]">
          <div className="flex flex-col flex-1 gap-4 p-1 overflow-y-scroll scrollbar-hide">
            <div className="flex justify-between gap-2">
              <Input size={12} placeholder="Lokalizacja" />
              <Input
                size={12}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                placeholder="Data odbioru"
                className="hidden md:block max-w-[185px]"
              />
              <Input
                size={12}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                placeholder="Data zwrotu"
                className="hidden md:block max-w-[185px]"
              />
              <Button
                type="button"
                className="w-[150px] hidden md:block"
                variant="secondary"
              >
                Filtry
              </Button>
              <Button type="button" className="w-[150px]">
                Szukaj
              </Button>
            </div>
            {carOffers.map((offer) => (
              <ListItem
                key={offer.id}
                make={offer.make}
                model={offer.model}
                pricePerDay={offer.price_per_day}
                imgSrc={offer.images[0]?.url || ''}
              />
            ))}
          </div>
          <div className="flex-1 hidden overflow-hidden rounded-lg lg:block">
            <Map
              markers={carOffers
                .filter((offer) => offer.point)
                .map((offer) => ({
                  id: offer.id!,
                  name: `${offer.make}, ${offer.model} - ${offer.price_per_day}`,
                  position: {
                    lat: Number(offer.point?.lat),
                    lng: Number(offer.point?.lon),
                  },
                }))}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<{
  carOffers: CarOfferRes[]
}> = async (context) => {
  const carOffers: CarOfferRes[] = await DefaultService.getOffers()
  console.log(carOffers)
  return {
    props: {
      carOffers,
    },
  }
}
