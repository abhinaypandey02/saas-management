import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FieldValues, useForm } from 'react-hook-form'

import { uuidv4 } from '@firebase/util'

import { addSaaS, deleteSaas, getAllSaaS } from '../firebase'
import Saas from '../interfaces/Saas'

import styles from '../styles/Home.module.css'

const Home: NextPage<{ allSaas: Saas[] }> = ({ allSaas }) => {
  const { register, handleSubmit, setValue, reset } = useForm()
  const [saas, setSaas] = useState(allSaas)
  const [loading, setLoading] = useState(false)
  const [selectedSaas, setSelectedSaas] = useState<Saas>()
  useEffect(() => {
    setValue('name', selectedSaas?.name || '')
    setValue(
      'date',
      selectedSaas?.date ? new Date(selectedSaas?.date).toISOString().split('T')[0] : ''
    )
  }, [selectedSaas])

  function onSubmit(data: FieldValues) {
    const saas = {
      name: data.name || '',
      date: data.date.toISOString() || '',
      id: selectedSaas ? selectedSaas.id : uuidv4(),
    }
    setLoading(true)
    addSaaS(saas)
      .then(() => {
        setSaas((o) => {
          if (selectedSaas) {
            return o.map((ss) => (selectedSaas.id === ss.id ? saas : ss))
          }
          return [...o, saas]
        })
      })
      .finally(() => {
        setSelectedSaas(undefined)
        setLoading(false)
        reset()
      })
  }
  return (
    <div className={'h-100 mr-auto'}>
      <form className={'p-5'} onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-2 sm:px-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Saas Name
                </label>
                <input
                  {...register('name', { required: true })}
                  type="text"
                  autoComplete="saas"
                  className="mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Renewal Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: true, valueAsDate: true })}
                  autoComplete="renewal-date"
                  className="mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className=" px-4 py-3 sm:px-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {selectedSaas ? 'Save Changes' : 'Add'}
            </button>
          </div>
        </div>
      </form>

      <div className="relative mt-8 overflow-x-auto p-5 shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 ">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Renewal date
              </th>
              <th scope="col" className="px-6 py-3">
                Edit
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {saas.map((s) => (
              <tr key={s.id} className="border-b bg-white hover:bg-gray-50 ">
                <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 ">
                  {s.name}
                </th>
                <td className="px-6 py-4">{new Date(s.date).toDateString()}</td>
                <td className="px-6 py-4 ">
                  <button
                    disabled={loading}
                    onClick={() => setSelectedSaas(s)}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Edit
                  </button>
                </td>
                <td className="px-6 py-4 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      setLoading(true)
                      deleteSaas(s.id)
                        .then(() => {
                          setSaas((old) => old.filter((ss) => ss.id !== s.id))
                        })
                        .finally(() => setLoading(false))
                    }}
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export async function getStaticProps() {
  const allSaas = await getAllSaaS()
  return {
    props: {
      allSaas,
    },
  }
}
export default Home
