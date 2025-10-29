const ContactRequestRepository = require('../repositories/ContactRequestRepository');

class Contact {
  static async createRequest(contactData) {
    const id = await ContactRequestRepository.create(contactData);
    return id;
  }

  static async getAllRequests() {
    return await ContactRequestRepository.getAll();
  }

  static async updateRequestStatus(id, status) {
    return await ContactRequestRepository.updateStatus(id, status);
  }

  static async getNewRequestsCount() {
    return await ContactRequestRepository.countByStatus('new');
  }
}

module.exports = Contact;

