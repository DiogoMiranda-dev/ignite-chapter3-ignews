import { render, screen } from '@testing-library/react'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { mocked } from 'ts-jest/utils'
import { useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

const post = {
    slug: 'fake-slug',
    title: 'fake title',
    content: '<p>fake content</p>',
    updatedAt: 'fake updatedAt'
};

jest.mock('next/router')
jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post Preview Page', () => {

    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false] as any)
        

        render(<Post post={post} />)

        expect(screen.getByText("fake title")).toBeInTheDocument()
        expect(screen.getByText("fake content")).toBeInTheDocument()
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {

        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([{ activeSubscription: 'fake-active-subscription' }, false] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any)

        render(<Post post={post} />)

        expect(pushMock).toHaveBeenCalledWith('/posts/fake-slug')
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


        const response = await getStaticProps({
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
