import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'

const posts = [
    {slug: 'fake slug', title: 'fake title', excerpt: 'fake excerpt', updatedAt: 'fake updatedAt'}
];

jest.mock('../../services/prismic')

describe('Posts Page', () => {

    it('renders correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText("fake title")).toBeInTheDocument()
    })

     it('loads initial data', async () => {
 
         const getPrismicClientMocked = mocked(getPrismicClient)
 
         getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results:[
                    {
                        uid:"fake slug",
                        data: {
                            title:[
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
                    }
                ]
            })
         } as any)
 
         const response = await getStaticProps({})
 
         expect(response).toEqual(
             expect.objectContaining({
                 props: {
                     posts: [{
                            slug:"fake slug",
                            title:"fake post",
                            excerpt: "post fake",
                            updatedAt: '01 de abril de 2021'
                        }]
                 }
             })
         )
     })


})
