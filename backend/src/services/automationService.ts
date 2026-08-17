import { Automation, IAutomation } from '../models/Automation';
import { ITicket } from '../models/Ticket';
import { User } from '../models/User';
import { Message } from '../models/Message';

export class AutomationService {
  /**
   * Run enabled automations on a ticket
   */
  public static async processTicketAutomations(ticket: ITicket): Promise<void> {
    try {
      const automations = await Automation.find({
        organizationId: ticket.organizationId,
        isEnabled: true,
      });

      if (!automations || automations.length === 0) return;

      for (const rule of automations) {
        const matches = this.checkConditions(ticket, rule);
        if (matches) {
          await this.executeActions(ticket, rule);
        }
      }
    } catch (error) {
      console.error('Error executing ticket automations:', error);
    }
  }

  private static checkConditions(ticket: ITicket, rule: IAutomation): boolean {
    if (!rule.conditions || rule.conditions.length === 0) return false;

    return rule.conditions.every((cond) => {
      const fieldVal = (ticket as any)[cond.field] || '';
      const textToSearch = `${ticket.subject} ${ticket.description}`.toLowerCase();

      switch (cond.field) {
        case 'priority':
          return cond.operator === 'equals' ? ticket.priority === cond.value : true;
        case 'sentiment':
          return cond.operator === 'equals' ? ticket.sentiment === cond.value : true;
        case 'category':
          return cond.operator === 'equals' ? ticket.category === cond.value : true;
        case 'contains_text':
          return textToSearch.includes(cond.value.toLowerCase());
        default:
          return false;
      }
    });
  }

  private static async executeActions(ticket: ITicket, rule: IAutomation): Promise<void> {
    let modified = false;

    for (const act of rule.actions) {
      switch (act.type) {
        case 'set_priority':
          ticket.priority = act.value as any;
          modified = true;
          break;

        case 'set_category':
          ticket.category = act.value;
          modified = true;
          break;

        case 'add_tag':
          if (!ticket.tags.includes(act.value)) {
            ticket.tags.push(act.value);
            modified = true;
          }
          break;

        case 'assign_agent':
          // Find an agent by email or role
          const agent = await User.findOne({
            $or: [{ email: act.value }, { role: 'AGENT' }],
            organizationId: ticket.organizationId,
          });
          if (agent) {
            ticket.assignedAgentId = agent._id as any;
            modified = true;
          }
          break;

        case 'send_internal_note':
          const botUser = await User.findOne({ role: 'ADMIN', organizationId: ticket.organizationId });
          if (botUser) {
            await Message.create({
              ticketId: ticket._id,
              senderId: botUser._id,
              senderRole: 'ADMIN',
              message: `🤖 [Automation Triggered: ${rule.name}] ${act.value}`,
              isInternalNote: true,
              aiGenerated: true,
            });
          }
          break;
      }
    }

    if (modified) {
      await ticket.save();
    }
  }
}
