import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import { INFURA_PROJECT_ID } from '../config';

/**
 * Creates an authenticated IPFS client using Infura
 * @returns {Object} IPFS client instance
 */
const getIPFSClient = () => {
  // You'll need your Infura project ID and secret for authentication
  const projectId = INFURA_PROJECT_ID;
  const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_SECRET;
  
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
  
  return client;
};

/**
 * Uploads data to IPFS and returns the CID
 * @param {Object|String} data - The data to upload to IPFS
 * @returns {Promise<String>} The IPFS CID of the uploaded content
 */
export const uploadToIPFS = async (data) => {
  try {
    const client = getIPFSClient();
    
    // Convert the data to a JSON string
    const jsonData = JSON.stringify(data);
    
    // Add the data to IPFS
    const added = await client.add(jsonData);
    
    // Return the CID
    return added.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

/**
 * Fetches data from IPFS using a CID
 * @param {String} cid - The IPFS CID to fetch
 * @returns {Promise<Object>} The data fetched from IPFS
 */
export const fetchFromIPFS = async (cid) => {
  try {
    // Use the IPFS gateway to fetch the data
    const response = await fetch(`https://ipfs.infura.io/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch data from IPFS');
  }
};