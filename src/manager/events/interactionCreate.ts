import { Interaction, MessageFlags } from "discord.js";
import { Manager } from "../../manager/index";
import { EventType } from "../../types/event";

const interactionCreateEvent: EventType = {
  name: "interactionCreate",
  once: false,

  async execute(manager: Manager, interaction: Interaction): Promise<any> {
    if (interaction.isAutocomplete()) {
      const commandName = interaction.commandName;
      const subCommandName = interaction.options.getSubcommand(false);
      const selfbot = manager.selfbots.get(interaction.user.id);

      let command;
      if (subCommandName) {
        command = manager.commands.get(`${commandName}:${subCommandName}`);
      } else {
        command = manager.commands.get(commandName);
      }

      if (!command) {
        return interaction.respond([]);
      }

      const focusedOption = interaction.options.getFocused(true);

      const optionDef = command.options?.find(
        (opt: any) =>
          opt.name === focusedOption.name &&
          typeof opt.autocomplete === "function"
      ) as any;

      if (optionDef) {
        try {
          const choices = await optionDef.autocomplete(manager, selfbot);
          return interaction.respond(choices);
        } catch (error) {
          console.error("Erreur lors de l'autocomplete :", error);
          return interaction.respond([]);
        }
      }

      return interaction.respond([]);
    }

    if (interaction.isModalSubmit()) {
      const customId = interaction.customId.split("-")[0];
      const selfbot = manager.selfbots.get(interaction.user.id);
      const modal = await import(`../interactions/modals/${customId}`);
      modal.default.execute(manager, selfbot, interaction);
    }

    if (interaction.isAnySelectMenu()) {
      const customId = interaction.customId.split("-")[0];
      const ignoreddropdown = [
        "grab",
        'backup_load_options'
      ];
      if (ignoreddropdown.includes(customId)) return;
      const selfbot = manager.selfbots.get(interaction.user.id);
      const select = await import(`../interactions/selects/${customId}`);
      select.default.execute(manager, selfbot, interaction);
    }

    if (interaction.isButton()) {
      const ignoredbutton = [
        "previous",
        "next",
        "pages",
        "reload",
        "rpc_content",
        "rpc_img_url",
        "rpc_skip",
        "backup_load_start",
        "backup_load_cancel"
      ];
      const customId = interaction.customId;
      if (ignoredbutton.includes(customId)) return;
      const selfbot = manager.selfbots.get(interaction.user.id);
      const button = await import(`../interactions/buttons/${customId}`);
      button.default.execute(manager, selfbot, interaction);
    }

    // Gestion des commandes slash
    if (interaction.isChatInputCommand()) {
      const commandName = interaction.commandName;
      const subCommandName = interaction.options.getSubcommand(false);
      const selfbot = manager.selfbots.get(interaction.user.id);

      if (!selfbot) {
        interaction.reply({
          content:
            interaction.locale === "fr"
              ? `Pour utiliser cette interaction, vous devez tout d'abord vous [connecter ici](https://discord.gg/mTPqk3fYYF) !`
              : `To use this interaction, you must first [log in here](https://discord.gg/mTPqk3fYYF)!`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      let command;
      if (subCommandName) {
        command = manager.commands.get(`${commandName}:${subCommandName}`);
      } else {
        command = manager.commands.get(commandName);
      }

      if (!command) {
        interaction.reply({
          content:
            interaction.locale === "fr"
              ? "Vous êtes perdu(e) ? Cette commande n'existe pas, vous feriez mieux de rafraîchir votre application en utilisant `Ctrl + R` sur votre PC ou en relançant l'application sur votre téléphone."
              : "Are you lost? This command does not exist. You should refresh your application by pressing `Ctrl + R` on your PC or restarting the app on your phone.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const now = Date.now();
      const cooldownKey = `${interaction.user.id}-${commandName}${subCommandName ? `:${subCommandName}` : ""
        }`;
      const lastUsage = manager.cooldowns.get(cooldownKey);

      if (lastUsage && now - lastUsage < (command.cooldown || 5000)) {
        await interaction.reply({
          content:
            interaction.locale === "fr"
              ? `Veuillez attendre ${(command.cooldown || 5000) / 1000
              } secondes avant de réutiliser cette interaction.`
              : `Please wait ${(command.cooldown || 5000) / 1000
              } seconds before using this interaction.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      manager.cooldowns.set(cooldownKey, now);

      try {
        command.execute(manager, selfbot, interaction);
      } catch (error) {
        console.error(error);
      }
    }
  },
};

export default interactionCreateEvent;
