# frozen_string_literal: true

module CnabParser
  class ParseError < StandardError; end

  def self.parse(line)
    {
      store: {
        owner: line[48..61]&.strip,
        name: line[62..80]&.strip,
      },
      transaction: {
        transaction_type: line[0].to_i,
        date: Date.parse(line[1..8]),
        amount: line[9..18].to_i / 100.0,
        cpf: line[19..29],
        card: line[30..41],
        time: line[42..47],
      },
    }
  rescue ArgumentError, TypeError => e
    raise ParseError, "Erro ao processar linha: #{e.message}"
  end
end
