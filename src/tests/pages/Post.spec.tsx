import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/client';

const post = {
    slug: 'fake slug',
    title: 'fake title',
    content: '<p>fake content</p>',
    updatedAt: 'fake updatedAt'
};

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post Page', () => {

    it('renders correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText("fake title")).toBeInTheDocument()
        expect(screen.getByText("fake content")).toBeInTheDocument()
    })

    it('redirects user if no subscriptions is found', async () => {

        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: 'fake slug'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it('loads initial data', async () => {

        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {
                            type: 'heading',
                            text: 'fake post'
                        }
                    ],
                    content: [
                        {
                            type: 'paragraph',
                            text: 'post fake'
                        }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)


        const response = await getServerSideProps({
            params: {
                slug: 'fake slug'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: "fake slug",
                        title: "fake post",
                        content: "<p>post fake</p>",
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })

})
