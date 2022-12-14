import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
//import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Buffer } from 'buffer';
const ipfsClient = require('ipfs-http-client');

const projectId = process.env.REACT_APP_PROJECT_KEY;
const projectSecret = process.env.REACT_APP_PROJECT_KEY_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
});

const Create = ({ marketplace, nft }) => {
    const [image, setImage] = useState('')
    const [price, setPrice] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const uploadToIPFS = async (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file)
                setImage(`https://catto.infura-ipfs.io/ipfs/${result.path}`)
            } catch (error) {
                console.log("IPFS image upload error: ", error)
            }
        }
    }
    const createNFT = async () => {
        if (!image || !price || !name || !description) return
        try {
            const result = await client.add(JSON.stringify({ image, name, description }))
            mintThenList(result)
        } catch (error) {
            console.log("IPFS URI upload error: ", error)
        }
    }
    const mintThenList = async (result) => {
        const uri = `https://catto.infura-ipfs.io/ipfs/${result.path}`
        // mint NFT
        await (await nft.mint(uri)).wait()
        // get tokenId of new NFT
        const id = await nft.tokenCount()
        // approve marketplace to spend NFT
        await (await nft.setApprovalForAll(marketplace.address, true)).wait()
        // add NFT to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                            />
                            <Form.Control 
                                onChange={(e) => setName(e.target.value)}
                                size="lg"
                                required
                                type="text"
                                placeholder="Name"
                            />
                            <Form.Control
                                onChange={(e) => setDescription(e.target.value)}
                                size="lg"
                                required
                                as="textarea"
                                placeholder="Description"
                            />
                            <Form.Control
                                onChange={(e) => setPrice(e.target.value)}
                                size="lg"
                                required
                                type="number"
                                placeholder="Price in ETH"
                            />
                            <div className="d-grid px-0">
                                <Button onClick={createNFT} variant="primary" size="lg">
                                    Create & List NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Create;